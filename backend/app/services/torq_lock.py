"""
TORQ-Lock Validator — cross-checks numeric specs against verified values.

Before displaying any numeric specification (torque, pressure, voltage) that the
LLM generates, this validator cross-checks it against dtc_kb/parts verified values.
If there's no match, it strips the number and says "check manufacturer specification."

This prevents the system from ever presenting an unverified numeric spec as fact.
"""

from __future__ import annotations

import logging
import re
from typing import Any

logger = logging.getLogger(__name__)

# Common spec patterns: number + optional unit
_SPEC_PATTERN = re.compile(
    r"(\d+\.?\d*)\s*(Nm|nm|N·m|ft[·\-]?lb|psi|kPa|bar|V|mV|A|mA|°C|°F|mm|cm|in|kg|lb|rpm|MPa)\b",
    re.IGNORECASE,
)


class TorqLockValidator:
    """
    Validates numeric specifications in LLM output against verified data.

    Usage:
        validator = TorqLockValidator()
        safe_text = validator.validate(llm_output, dtc_entry, parts_list)
    """

    def __init__(self, tolerance: float = 0.15):
        """
        Args:
            tolerance: Fractional tolerance for numeric matching (0.15 = ±15%).
        """
        self._tolerance = tolerance

    def validate(
        self,
        llm_text: str,
        dtc_entry: dict[str, Any] | None = None,
        parts: list[dict[str, Any]] | None = None,
    ) -> str:
        """
        Scan LLM output for numeric specs and cross-check against verified sources.

        Any unverified numeric spec is replaced with a safe fallback message.

        Args:
            llm_text: Raw text from the LLM.
            dtc_entry: The dtc_kb row for the relevant DTC.
            parts: List of parts from the parts table.

        Returns:
            Validated text with unverified specs replaced.
        """
        verified_values = self._collect_verified_values(dtc_entry, parts)

        if not verified_values:
            # No verified data to check against — strip ALL numeric specs
            return self._strip_all_specs(llm_text)

        def replace_spec(match: re.Match) -> str:
            value = float(match.group(1))
            unit = match.group(2).lower()

            # Check if this value+unit pair is verified
            if self._is_verified(value, unit, verified_values):
                return match.group(0)  # Keep the original
            else:
                logger.warning(
                    "TORQ-Lock: Stripped unverified spec %.1f %s",
                    value, unit,
                )
                return "⚠️ [check manufacturer specification]"

        return _SPEC_PATTERN.sub(replace_spec, llm_text)

    def _collect_verified_values(
        self,
        dtc_entry: dict[str, Any] | None,
        parts: list[dict[str, Any]] | None,
    ) -> list[dict[str, Any]]:
        """Collect all verified numeric values from knowledge sources."""
        verified = []

        # From DTC KB — possible_causes may have verified_specs
        if dtc_entry:
            for cause in dtc_entry.get("possible_causes", []):
                specs = cause.get("verified_specs", {})
                for spec_key, spec_value in specs.items():
                    # Parse unit from key (e.g., "torque_nm" -> unit="nm", value=45)
                    unit = self._extract_unit_from_key(spec_key)
                    if unit and isinstance(spec_value, (int, float)):
                        verified.append({"value": float(spec_value), "unit": unit})

            # From diagnostic_steps — may have expected values
            for step in dtc_entry.get("diagnostic_steps", []):
                for key, val in step.items():
                    if isinstance(val, (int, float)) and key not in ("id",):
                        unit = self._extract_unit_from_key(key)
                        if unit:
                            verified.append({"value": float(val), "unit": unit})

        # From parts — prices aren't specs, but parts may have spec fields
        if parts:
            for part in parts:
                specs = part.get("specs", {})
                for spec_key, spec_value in specs.items():
                    unit = self._extract_unit_from_key(spec_key)
                    if unit and isinstance(spec_value, (int, float)):
                        verified.append({"value": float(spec_value), "unit": unit})

        return verified

    def _is_verified(
        self,
        value: float,
        unit: str,
        verified: list[dict[str, Any]],
    ) -> bool:
        """Check if a value+unit pair matches any verified value within tolerance."""
        unit_lower = unit.lower()
        unit_aliases = self._get_unit_aliases(unit_lower)

        for v in verified:
            v_unit = v["unit"].lower()
            if v_unit in unit_aliases or unit_lower in self._get_unit_aliases(v_unit):
                v_value = v["value"]
                if v_value == 0:
                    if value == 0:
                        return True
                else:
                    if abs(value - v_value) / abs(v_value) <= self._tolerance:
                        return True
        return False

    @staticmethod
    def _extract_unit_from_key(key: str) -> str | None:
        """Extract unit abbreviation from a spec key like 'torque_nm' or 'voltage_v'."""
        unit_map = {
            "nm": "nm", "n_m": "nm", "torque": "nm",
            "psi": "psi", "kpa": "kpa", "bar": "bar", "pressure": "kpa",
            "v": "v", "mv": "mv", "voltage": "v",
            "a": "a", "ma": "ma", "current": "a",
            "rpm": "rpm",
            "mm": "mm", "cm": "cm",
            "c": "°c", "f": "°f", "temp": "°c",
        }
        key_lower = key.lower()
        for suffix, unit in unit_map.items():
            if key_lower.endswith(f"_{suffix}") or key_lower == suffix:
                return unit
        return None

    @staticmethod
    def _get_unit_aliases(unit: str) -> set[str]:
        """Get equivalent unit representations."""
        aliases = {
            "nm": {"nm", "n·m", "n-m"},
            "v": {"v"},
            "mv": {"mv"},
            "psi": {"psi"},
            "kpa": {"kpa"},
            "bar": {"bar"},
            "mpa": {"mpa"},
            "a": {"a"},
            "ma": {"ma"},
            "°c": {"°c", "c"},
            "°f": {"°f", "f"},
            "mm": {"mm"},
            "cm": {"cm"},
            "in": {"in"},
            "rpm": {"rpm"},
            "ft-lb": {"ft-lb", "ft·lb", "ft lb"},
        }
        return aliases.get(unit.lower(), {unit.lower()})

    def _strip_all_specs(self, text: str) -> str:
        """Replace all numeric specs when no verified data is available."""
        def replace_all(match: re.Match) -> str:
            logger.warning("TORQ-Lock: No verified data — stripped %s", match.group(0))
            return "⚠️ [check manufacturer specification]"

        return _SPEC_PATTERN.sub(replace_all, text)
