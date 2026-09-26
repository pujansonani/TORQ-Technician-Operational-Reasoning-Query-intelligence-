"""
Core Diagnostic Engine — implements the TORQ diagnostic algorithm.

This is the heart of the system. It implements a Bayesian diagnostic workflow:
1. Compute priors from DTC knowledge base + symptom keyword matching
2. Select next-best-test using information-gain heuristic
3. Bayesian update on each test result
4. Confidence scoring with escalation threshold
5. TORQ-Lock numeric validation (delegated to torq_lock.py)

Philosophy: INPUT → UNDERSTAND → RETRIEVE → EVALUATE EVIDENCE → RECOMMEND TEST →
GET RESULT → UPDATE → CONFIRM CAUSE → REPAIR.
Never: INPUT → LLM guess → "replace this part."
"""

from __future__ import annotations

import logging
import math
import re
from typing import Any

from app.schemas.diagnosis import CandidateCause, RecommendedTest

logger = logging.getLogger(__name__)


class DiagnosticEngine:
    """
    Bayesian diagnostic engine for truck fault diagnosis.

    Works with the structured dtc_kb data to score candidate causes,
    select optimal diagnostic tests, and update beliefs based on results.
    """

    def __init__(self, escalation_threshold: float = 40.0):
        self._escalation_threshold = escalation_threshold

    # ── Step 1: Compute Prior Probabilities ──────────────────────────

    def compute_priors(
        self,
        dtc_entry: dict[str, Any],
        symptom_text: str,
    ) -> dict[str, float]:
        """
        Compute prior probability for each candidate cause.

        Formula: prior[cause] = base_rate(cause | dtc) × keyword_match(symptom_text, cause.symptom_keywords)
        Then normalize into a probability distribution.

        Args:
            dtc_entry: The dtc_kb row (as dict) for the primary DTC code.
            symptom_text: The technician's natural-language symptom description.

        Returns:
            Dict mapping cause_id -> prior probability (sums to 1.0)
        """
        possible_causes = dtc_entry.get("possible_causes", [])
        if not possible_causes:
            logger.warning("No possible causes in DTC entry for %s", dtc_entry.get("code"))
            return {}

        symptom_lower = symptom_text.lower()
        raw_scores: dict[str, float] = {}

        for cause in possible_causes:
            cause_id = cause["id"]
            base_rate = cause.get("base_rate", 1.0 / len(possible_causes))

            # Keyword matching: count how many symptom keywords appear in the symptom text
            keywords = cause.get("symptom_keywords", [])
            if keywords:
                matches = sum(1 for kw in keywords if kw.lower() in symptom_lower)
                # Scale: 1.0 base + 0.5 per match (so keywords boost but don't dominate)
                keyword_score = 1.0 + (0.5 * matches)
            else:
                keyword_score = 1.0

            raw_scores[cause_id] = base_rate * keyword_score

        # Normalize to probability distribution
        total = sum(raw_scores.values())
        if total == 0:
            # Uniform fallback
            n = len(possible_causes)
            return {c["id"]: 1.0 / n for c in possible_causes}

        return {cid: score / total for cid, score in raw_scores.items()}

    # ── Step 2: Next-Best-Test Selection ─────────────────────────────

    def select_next_test(
        self,
        dtc_entry: dict[str, Any],
        current_posteriors: dict[str, float],
        completed_test_ids: set[str],
    ) -> RecommendedTest | None:
        """
        Select the diagnostic test whose pass/fail outcome most evenly
        splits the probability mass across remaining candidates.

        This is an information-gain / "20 questions" heuristic: the best test
        is the one where knowing the result gives us the most information
        about which cause is correct.

        The discriminative score for each test is:
          score = -|P(causes discriminated as 'fail') - 0.5|
        A test that splits probability 50/50 scores 0 (best).
        A test that only discriminates a 1% cause scores -0.49 (worst).
        """
        diagnostic_steps = dtc_entry.get("diagnostic_steps", [])
        if not diagnostic_steps:
            return None

        # Filter out already-completed tests
        available_tests = [
            step for step in diagnostic_steps
            if step["id"] not in completed_test_ids
        ]
        if not available_tests:
            return None

        best_test = None
        best_score = -float("inf")

        for test in available_tests:
            discriminates = set(test.get("discriminates", []))
            expected_if_cause = test.get("expected_if_cause", {})

            if not discriminates:
                continue

            # Calculate the probability mass that this test would
            # assign to "fail" (i.e., the cause IS one of the discriminated causes)
            p_fail = sum(
                current_posteriors.get(cid, 0.0)
                for cid in discriminates
                if expected_if_cause.get(cid) == "fail"
            )

            # Also consider causes that would show "pass"
            p_pass = sum(
                current_posteriors.get(cid, 0.0)
                for cid in discriminates
                if expected_if_cause.get(cid) != "fail"
            )

            # The total probability mass this test can discriminate
            p_total_discriminated = sum(
                current_posteriors.get(cid, 0.0) for cid in discriminates
            )

            # Score: how close to 50/50 split does this test achieve?
            # Using the discriminated mass vs non-discriminated mass split
            if p_total_discriminated > 0:
                balance = p_total_discriminated  # How much probability this test addresses
                evenness = 1.0 - abs(p_fail - (p_total_discriminated - p_fail)) / max(p_total_discriminated, 0.001)
                score = balance * evenness  # Prefer tests that address more mass AND split it evenly
            else:
                score = 0.0

            if score > best_score:
                best_score = score
                best_test = test

        if best_test is None:
            # Fallback: just pick the first untested test
            best_test = available_tests[0]

        return RecommendedTest(
            test_id=best_test["id"],
            description=best_test.get("description", "Perform diagnostic test"),
            test_type=best_test.get("type", "pass_fail"),
            discriminates_causes=best_test.get("discriminates", []),
            reasoning=self._generate_test_reasoning(best_test, current_posteriors),
        )

    def _generate_test_reasoning(
        self,
        test: dict[str, Any],
        posteriors: dict[str, float],
    ) -> str:
        """Generate human-readable reasoning for why this test was selected."""
        discriminates = test.get("discriminates", [])
        total_mass = sum(posteriors.get(cid, 0.0) for cid in discriminates)
        return (
            f"This test discriminates between {len(discriminates)} candidate causes "
            f"covering {total_mass:.0%} of the current probability mass. "
            f"The result will significantly narrow down the root cause."
        )

    # ── Step 3: Bayesian Update ──────────────────────────────────────

    def _evaluate_outcome(self, result_text: str, test_def: dict[str, Any]) -> str:
        """
        Evaluate technician's result input against test definition.
        Returns 'pass', 'fail', or 'unknown'.
        """
        res = result_text.strip().lower()
        if res in ("pass", "ok", "good", "normal", "yes", "passed", "within spec", "positive", "true", "fine"):
            return "pass"
        if res in ("fail", "bad", "low", "high", "abnormal", "no", "failed", "out of spec", "negative", "false", "leak", "dirty", "clogged", "broken"):
            return "fail"

        # Check numeric comparison against description or specs
        num = self._extract_number(res)
        desc = test_def.get("description", "").lower()
        if num is not None:
            # Check for "≥ 280", ">= 280", "â‰¥ 280", "Expected: ≥ 280", "Expected: 280"
            gte_match = re.search(r"(?:≥|>=|â‰¥|>|<|\bmin\b|\bat least\b|expected[:\s]+[^\d]*)(\d+(?:\.\d+)?)", desc, re.IGNORECASE)
            if gte_match:
                thresh = float(gte_match.group(1))
                return "pass" if num >= thresh else "fail"

            # Check for range e.g. "4.5-5.5" or "0.5-0.8" or "20-80"
            range_match = re.search(r"(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)", desc)
            if range_match:
                low_val, high_val = float(range_match.group(1)), float(range_match.group(2))
                return "pass" if (low_val * 0.9 <= num <= high_val * 1.1) else "fail"

            # Check for "~2200" or "approx 2200"
            approx_match = re.search(r"(?:~|\bapprox\b|\babout\b)\s*(\d+(?:\.\d+)?)", desc)
            if approx_match:
                target_val = float(approx_match.group(1))
                return "pass" if (target_val * 0.7 <= num <= target_val * 1.3) else "fail"

        return "unknown"

    def bayesian_update(
        self,
        current_posteriors: dict[str, float],
        test_id: str,
        result: str,
        dtc_entry: dict[str, Any],
    ) -> dict[str, float]:
        """
        Bayesian update: P(cause | result) ∝ P(result | cause) × P(cause)

        For each cause, compute the likelihood of seeing this test result
        given that cause is the true root cause, then multiply by the prior
        and renormalize.
        """
        # Find the test definition
        test_def = None
        for step in dtc_entry.get("diagnostic_steps", []):
            if step["id"] == test_id:
                test_def = step
                break

        if test_def is None:
            logger.warning("Test ID '%s' not found in DTC entry — returning unchanged posteriors", test_id)
            return current_posteriors

        expected_if_cause = test_def.get("expected_if_cause", {})
        result_normalized = result.strip().lower()
        outcome = self._evaluate_outcome(result, test_def)
        discriminates = set(test_def.get("discriminates", []))

        updated: dict[str, float] = {}

        for cause_id, prior_p in current_posteriors.items():
            expected = expected_if_cause.get(cause_id)

            if expected is None and cause_id not in discriminates:
                # Test does not discriminate this cause — neutral evidence
                likelihood = 0.50
            elif outcome == "pass":
                if expected == "pass":
                    likelihood = 0.88
                elif expected == "fail":
                    likelihood = 0.12
                else:
                    likelihood = 0.50
            elif outcome == "fail":
                if expected == "fail":
                    likelihood = 0.90
                elif expected == "pass":
                    likelihood = 0.10
                else:
                    likelihood = 0.50
            elif result_normalized == (expected or "").lower():
                likelihood = 0.88
            elif result_normalized in ("pass", "fail") and (expected or "").lower() in ("pass", "fail"):
                likelihood = 0.12
            else:
                expected_str = (expected or "pass").lower()
                likelihood = self._measurement_likelihood(result_normalized, expected_str)

            updated[cause_id] = likelihood * prior_p

        # Renormalize
        total = sum(updated.values())
        if total == 0:
            n = len(updated)
            return {cid: 1.0 / n for cid in updated}

        return {cid: p / total for cid, p in updated.items()}

    def _measurement_likelihood(self, actual: str, expected: str) -> float:
        """Compute likelihood for measurement-type test results."""
        actual_num = self._extract_number(actual)
        expected_num = self._extract_number(expected)

        if actual_num is not None and expected_num is not None:
            if expected_num == 0:
                ratio = 1.0 if actual_num == 0 else 0.3
            else:
                ratio = abs(actual_num - expected_num) / abs(expected_num)
            likelihood = 1.0 / (1.0 + ratio * 5)
            return max(0.05, min(0.95, likelihood))

        if actual == expected:
            return 0.9
        elif expected in actual or actual in expected:
            return 0.6
        else:
            return 0.3

    @staticmethod
    def _extract_number(text: str) -> float | None:
        """Extract a numeric value from a string like '14.2V' or '350kPa'."""
        match = re.search(r"[-+]?\d*\.?\d+", text)
        if match:
            try:
                return float(match.group())
            except ValueError:
                return None
        return None

    # ── Step 4: Confidence Score ─────────────────────────────────────

    def confidence_score(self, posteriors: dict[str, float]) -> float:
        """
        Compute the Diagnostic Confidence Score.

        Score = (top_candidate_probability − second_candidate_probability) × 100

        If score < escalation_threshold (40), the system should recommend
        escalation to dealer/DAVIE4 rather than suggesting a single cause.
        """
        if len(posteriors) < 2:
            return 100.0 if posteriors else 0.0

        sorted_probs = sorted(posteriors.values(), reverse=True)
        top = sorted_probs[0]
        second = sorted_probs[1]

        return round((top - second) * 100, 1)

    def should_escalate(self, posteriors: dict[str, float]) -> tuple[bool, str]:
        """Check if confidence is too low and escalation is needed."""
        score = self.confidence_score(posteriors)
        if score < self._escalation_threshold:
            return True, (
                f"Diagnostic confidence score is {score:.1f} (threshold: {self._escalation_threshold}). "
                f"Multiple causes remain equally likely. "
                f"Recommend escalation to dealer diagnostic tools (DAVIE4) for further analysis."
            )
        return False, ""

    def is_diagnosis_complete(self, posteriors: dict[str, float], threshold: float = 0.85) -> bool:
        """Check if the top candidate has sufficient probability to be considered confirmed."""
        if not posteriors:
            return False
        top_prob = max(posteriors.values())
        return top_prob >= threshold

    def get_top_cause(self, posteriors: dict[str, float]) -> tuple[str, float]:
        """Return the top candidate cause ID and its probability."""
        if not posteriors:
            return "", 0.0
        top_id = max(posteriors, key=posteriors.get)  # type: ignore[arg-type]
        return top_id, posteriors[top_id]

    # ── Utility: Build CandidateCause list for API response ──────────

    def build_candidate_list(
        self,
        posteriors: dict[str, float],
        dtc_entry: dict[str, Any],
        evidence_log: list[dict[str, Any]] | None = None,
    ) -> list[CandidateCause]:
        """
        Build a sorted list of CandidateCause objects for the API response.
        """
        cause_map = {
            c["id"]: c for c in dtc_entry.get("possible_causes", [])
        }
        evidence_log = evidence_log or []

        candidates = []
        for cause_id, prob in sorted(posteriors.items(), key=lambda x: x[1], reverse=True):
            cause_info = cause_map.get(cause_id, {})
            # Collect evidence for this cause
            cause_evidence = [
                f"Test '{e['test_id']}': {e['result']}"
                for e in evidence_log
                if cause_id in e.get("affected_causes", [])
            ]

            candidates.append(CandidateCause(
                id=cause_id,
                name=cause_info.get("name", cause_id),
                probability=round(prob, 4),
                evidence=cause_evidence,
                source_snippet=cause_info.get("description", ""),
            ))

        # Sort by probability descending
        candidates.sort(key=lambda c: c.probability, reverse=True)
        return candidates
