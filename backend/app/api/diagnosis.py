"""
Diagnosis API routes — the core diagnostic workflow endpoints.

POST /api/diagnose          → Start a new diagnostic session
POST /api/sessions/{id}/test-result → Submit a test result and get updated diagnosis
GET  /api/sessions/{id}     → Get full session state
"""

from __future__ import annotations

import uuid
import logging
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.dtc_kb import DtcKb
from app.models.truck import Truck
from app.models.session import Session
from app.models.session_event import SessionEvent
from app.schemas.diagnosis import (
    DiagnoseRequest,
    DiagnosisResponse,
    TestResultRequest,
    SessionState,
    CandidateCause,
)
from app.services.diagnostic_engine import DiagnosticEngine
from app.services.rag_service import get_rag_service
from app.services.torq_lock import TorqLockValidator
from app.services.cost_estimator import CostEstimator
from app.llm import get_llm_provider

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["diagnosis"])

engine = DiagnosticEngine()
torq_lock = TorqLockValidator()
cost_estimator = CostEstimator()


# ── Prompts for the LLM ─────────────────────────────────────────────

DIAGNOSIS_SYSTEM_PROMPT = """You are TORQ, an AI diagnostic copilot for truck service technicians.
You are given a DTC fault code, the technician's symptom description, and relevant
diagnostic procedure documentation retrieved from the knowledge base.

Your job is to:
1. Analyze the symptom against the known possible causes for this DTC.
2. Provide a concise, technical summary explaining the diagnostic situation.
3. Suggest what evidence supports or contradicts each candidate cause.

CRITICAL RULES:
- Do NOT guess a fix. Never say "replace X" without confirmed diagnosis.
- Do NOT invent numeric specifications (torque values, pressures, voltages).
- Cite specific information from the provided knowledge base context.
- Be concise and technical — this is for experienced technicians, not customers.
- Focus on what tests would help narrow down the cause.

Respond in JSON format:
{
    "summary": "Brief technical assessment of the diagnostic situation",
    "cause_analysis": [
        {
            "cause_id": "cause identifier",
            "assessment": "Why this cause is or isn't likely based on symptoms",
            "supporting_evidence": ["evidence point 1", "..."],
            "contradicting_evidence": ["evidence point 1", "..."]
        }
    ]
}"""


@router.post("/diagnose", response_model=DiagnosisResponse)
async def start_diagnosis(
    request: DiagnoseRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Start a new diagnostic session.

    1. Looks up DTC in dtc_kb
    2. Retrieves relevant knowledge via RAG
    3. Computes prior probabilities
    4. Selects the next best test
    5. Returns structured diagnosis with confidence
    """
    # Verify truck exists
    truck = await db.execute(select(Truck).where(Truck.id == request.truck_id))
    truck_obj = truck.scalar_one_or_none()
    if not truck_obj:
        raise HTTPException(status_code=404, detail="Truck not found")

    # Look up the primary DTC code
    primary_dtc = request.dtc_codes[0]
    dtc_result = await db.execute(select(DtcKb).where(DtcKb.code == primary_dtc))
    dtc_entry_obj = dtc_result.scalar_one_or_none()

    if not dtc_entry_obj:
        raise HTTPException(
            status_code=404,
            detail=f"DTC code '{primary_dtc}' not found in knowledge base. "
                   f"Ensure the code is in SAE J1939 format (e.g., SPN-FMI).",
        )

    dtc_entry = {
        "code": dtc_entry_obj.code,
        "description": dtc_entry_obj.description,
        "subsystem": dtc_entry_obj.subsystem,
        "possible_causes": dtc_entry_obj.possible_causes,
        "diagnostic_steps": dtc_entry_obj.diagnostic_steps,
        "severity": dtc_entry_obj.severity,
    }

    # RAG retrieval
    rag_service = get_rag_service()
    context_text, citations = rag_service.retrieve(
        symptom_text=request.symptom_text,
        dtc_codes=request.dtc_codes,
    )

    # Compute priors
    priors = engine.compute_priors(dtc_entry, request.symptom_text)

    # Select next best test
    recommended_test = engine.select_next_test(dtc_entry, priors, set())

    # Confidence score
    confidence = engine.confidence_score(priors)
    should_esc, esc_reason = engine.should_escalate(priors)

    # Build candidate list
    candidates = engine.build_candidate_list(priors, dtc_entry)
    for c in candidates:
        c.estimated_cost = await cost_estimator.estimate(db, c.id, dtc_entry, truck_obj.model)

    # Get LLM summary (with TORQ-Lock validation)
    llm_summary = ""
    try:
        llm = get_llm_provider()
        user_prompt = (
            f"DTC Code: {primary_dtc} — {dtc_entry['description']}\n"
            f"Subsystem: {dtc_entry['subsystem']}\n"
            f"Symptom: {request.symptom_text}\n"
            f"Vehicle: {truck_obj.brand} {truck_obj.model} ({truck_obj.year})\n\n"
            f"Knowledge Base Context:\n{context_text}\n\n"
            f"Candidate Causes:\n"
        )
        for c in candidates:
            user_prompt += f"- {c.name} (prior probability: {c.probability:.1%})\n"

        llm_result = await llm.complete(DIAGNOSIS_SYSTEM_PROMPT, user_prompt)
        llm_summary = torq_lock.validate(llm_result, dtc_entry)
    except Exception as e:
        logger.error("LLM call failed: %s", e)
        llm_summary = "LLM analysis unavailable — proceeding with algorithmic diagnosis."

    # Create session
    session = Session(
        truck_id=request.truck_id,
        symptom_text=request.symptom_text,
        dtc_codes=request.dtc_codes,
        status="active",
    )
    db.add(session)
    await db.flush()

    # Log the diagnosis_started event
    event = SessionEvent(
        session_id=session.id,
        type="diagnosis_started",
        payload={
            "dtc_codes": request.dtc_codes,
            "priors": {k: round(v, 4) for k, v in priors.items()},
            "recommended_test_id": recommended_test.test_id if recommended_test else None,
        },
    )
    db.add(event)

    # Log test_recommended event
    if recommended_test:
        test_event = SessionEvent(
            session_id=session.id,
            type="test_recommended",
            payload={
                "test_id": recommended_test.test_id,
                "description": recommended_test.description,
                "discriminates": recommended_test.discriminates_causes,
            },
        )
        db.add(test_event)

    await db.commit()

    # Cost estimate for top cause
    top_cause_id, top_prob = engine.get_top_cause(priors)
    cost_est = await cost_estimator.estimate(db, top_cause_id, dtc_entry, truck_obj.model)

    # ── Console logging for terminal visibility ──
    logger.info("=" * 72)
    logger.info("🔍 [TORQ DIAGNOSIS STARTED]")
    logger.info("Vehicle:     %s %s (%s) — VIN: ...%s", truck_obj.brand, truck_obj.model, truck_obj.year, truck_obj.vin[-6:])
    logger.info("Fault Code:  %s — %s (Severity: %s/5)", primary_dtc, dtc_entry['description'], dtc_entry['severity'])
    logger.info("Subsystem:   %s", dtc_entry['subsystem'])
    symptom_preview = request.symptom_text[:100] + ("..." if len(request.symptom_text) > 100 else "")
    logger.info("Symptom:     \"%s\"", symptom_preview)
    logger.info("RAG Context: %d procedure chunks retrieved from ChromaDB", len(citations))
    logger.info("Initial Bayesian Priors:")
    for c in candidates:
        logger.info("  • %-36s : %5.1f%%", c.name, c.probability * 100)
    if recommended_test:
        logger.info("Recommended Next Test: [%s]", recommended_test.test_id)
        logger.info("  → %s", recommended_test.description)
    logger.info("Initial Confidence Score: %.1f%% | Status: Active", confidence)
    logger.info("Session ID:  %s", session.id)
    logger.info("=" * 72)

    return DiagnosisResponse(
        session_id=session.id,
        dtc_codes=request.dtc_codes,
        candidate_causes=candidates,
        recommended_test=recommended_test,
        confidence_score=confidence,
        should_escalate=should_esc,
        escalation_reason=esc_reason,
        cost_estimate=cost_est,
        citations=citations,
        llm_summary=llm_summary,
    )


@router.post("/sessions/{session_id}/test-result", response_model=DiagnosisResponse)
async def submit_test_result(
    session_id: uuid.UUID,
    request: TestResultRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Submit a diagnostic test result and get updated diagnosis.

    Performs Bayesian update on the probability distribution,
    re-selects the next best test, and checks for completion.
    """
    # Load session with events
    result = await db.execute(
        select(Session)
        .options(selectinload(Session.events))
        .where(Session.id == session_id)
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session.status != "active":
        raise HTTPException(status_code=400, detail="Session is no longer active")

    # Load DTC entry
    primary_dtc = session.dtc_codes[0]
    dtc_result = await db.execute(select(DtcKb).where(DtcKb.code == primary_dtc))
    dtc_entry_obj = dtc_result.scalar_one_or_none()
    if not dtc_entry_obj:
        raise HTTPException(status_code=404, detail="DTC code not found")

    dtc_entry = {
        "code": dtc_entry_obj.code,
        "description": dtc_entry_obj.description,
        "subsystem": dtc_entry_obj.subsystem,
        "possible_causes": dtc_entry_obj.possible_causes,
        "diagnostic_steps": dtc_entry_obj.diagnostic_steps,
        "severity": dtc_entry_obj.severity,
    }

    # Reconstruct current posteriors from session events
    current_posteriors = _reconstruct_posteriors(session.events, dtc_entry)

    # If no posteriors yet (first test), compute from priors
    if not current_posteriors:
        current_posteriors = engine.compute_priors(dtc_entry, session.symptom_text)

    # Bayesian update
    updated_posteriors = engine.bayesian_update(
        current_posteriors, request.test_id, request.result, dtc_entry,
    )

    # Determine completed tests
    completed_test_ids = _get_completed_test_ids(session.events)
    completed_test_ids.add(request.test_id)

    # Log the result_entered event
    result_event = SessionEvent(
        session_id=session.id,
        type="result_entered",
        payload={
            "test_id": request.test_id,
            "result": request.result,
            "notes": request.notes,
            "posteriors_before": {k: round(v, 4) for k, v in current_posteriors.items()},
            "posteriors_after": {k: round(v, 4) for k, v in updated_posteriors.items()},
        },
    )
    db.add(result_event)

    # Check if diagnosis is complete
    diagnosis_complete = engine.is_diagnosis_complete(updated_posteriors)
    confidence = engine.confidence_score(updated_posteriors)
    should_esc, esc_reason = engine.should_escalate(updated_posteriors)

    root_cause = None
    if diagnosis_complete:
        top_id, top_prob = engine.get_top_cause(updated_posteriors)
        # Find cause name
        cause_map = {c["id"]: c["name"] for c in dtc_entry.get("possible_causes", [])}
        root_cause = cause_map.get(top_id, top_id)
        session.status = "resolved"
        session.root_cause = root_cause

        # Log cause_updated event
        cause_event = SessionEvent(
            session_id=session.id,
            type="cause_updated",
            payload={"root_cause": root_cause, "confidence": confidence},
        )
        db.add(cause_event)

    # Log updated posteriors
    update_event = SessionEvent(
        session_id=session.id,
        type="cause_updated",
        payload={
            "posteriors": {k: round(v, 4) for k, v in updated_posteriors.items()},
            "confidence_score": confidence,
        },
    )
    db.add(update_event)

    # Select next test as long as unperformed tests exist
    recommended_test = engine.select_next_test(
        dtc_entry, updated_posteriors, completed_test_ids,
    )
    if recommended_test:
        test_event = SessionEvent(
            session_id=session.id,
            type="test_recommended",
            payload={
                "test_id": recommended_test.test_id,
                "description": recommended_test.description,
            },
        )
        db.add(test_event)

    await db.commit()

    # Build response
    candidates = engine.build_candidate_list(updated_posteriors, dtc_entry)
    for c in candidates:
        c.estimated_cost = await cost_estimator.estimate(db, c.id, dtc_entry)
    evidence_log = _build_evidence_log(session.events)

    # Cost estimate for top cause
    top_cause_id, _ = engine.get_top_cause(updated_posteriors)
    cost_est = await cost_estimator.estimate(db, top_cause_id, dtc_entry)

    # Citations
    citations = []
    if dtc_entry:
        rag_service = get_rag_service()
        _, citations = rag_service.retrieve(session.symptom_text, session.dtc_codes)

    # ── Console logging for terminal visibility ──
    logger.info("=" * 72)
    logger.info("🧪 [TORQ TEST RESULT SUBMITTED]")
    logger.info("Session ID:    %s", session.id)
    logger.info("Test Executed: %s", request.test_id)
    notes_str = f" (Notes: {request.notes})" if request.notes else ""
    logger.info("Result Given:  %s%s", request.result.upper(), notes_str)
    logger.info("Bayesian Probability Update:")
    cause_map = {c["id"]: c["name"] for c in dtc_entry.get("possible_causes", [])}
    for cid, new_p in sorted(updated_posteriors.items(), key=lambda x: x[1], reverse=True):
        old_p = current_posteriors.get(cid, 0.0)
        direction = "▲" if new_p > old_p + 0.01 else "▼" if new_p < old_p - 0.01 else "•"
        cause_name = cause_map.get(cid, cid)
        logger.info("  %s %-34s : %5.1f%% → %5.1f%%", direction, cause_name, old_p * 100, new_p * 100)
    logger.info("Updated Confidence Score: %.1f%% (Threshold: 40.0%%)", confidence)
    if diagnosis_complete:
        logger.info("🎯 [ROOT CAUSE CONFIRMED]: %s", root_cause)
        logger.info("Estimated Total Cost:    %s", f"${cost_est.total:,.2f}" if cost_est else "N/A")
        logger.info("Status:                  RESOLVED (Diagnosis Complete)")
    elif recommended_test:
        logger.info("Next Recommended Test:   [%s]", recommended_test.test_id)
        logger.info("  → %s", recommended_test.description)
    else:
        logger.info("ℹ️ All available diagnostic tests completed.")
    logger.info("=" * 72)

    return DiagnosisResponse(
        session_id=session.id,
        dtc_codes=session.dtc_codes,
        candidate_causes=candidates,
        recommended_test=recommended_test,
        confidence_score=confidence,
        should_escalate=should_esc,
        escalation_reason=esc_reason,
        cost_estimate=cost_est,
        citations=citations,
        diagnosis_complete=diagnosis_complete,
        root_cause=root_cause,
    )


@router.get("/sessions/{session_id}", response_model=SessionState)
async def get_session(
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Get the full state of a diagnostic session."""
    result = await db.execute(
        select(Session)
        .options(selectinload(Session.events))
        .where(Session.id == session_id)
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Load DTC entry
    primary_dtc = session.dtc_codes[0] if session.dtc_codes else None
    dtc_entry = None
    if primary_dtc:
        dtc_result = await db.execute(select(DtcKb).where(DtcKb.code == primary_dtc))
        dtc_entry_obj = dtc_result.scalar_one_or_none()
        if dtc_entry_obj:
            dtc_entry = {
                "code": dtc_entry_obj.code,
                "description": dtc_entry_obj.description,
                "subsystem": dtc_entry_obj.subsystem,
                "possible_causes": dtc_entry_obj.possible_causes,
                "diagnostic_steps": dtc_entry_obj.diagnostic_steps,
                "severity": dtc_entry_obj.severity,
            }

    # Reconstruct state
    posteriors = _reconstruct_posteriors(session.events, dtc_entry) if dtc_entry else {}
    if not posteriors and dtc_entry:
        posteriors = engine.compute_priors(dtc_entry, session.symptom_text)

    completed_test_ids = _get_completed_test_ids(session.events)
    completed_tests = _build_completed_tests(session.events)
    candidates = engine.build_candidate_list(posteriors, dtc_entry) if dtc_entry else []
    if dtc_entry:
        for c in candidates:
            c.estimated_cost = await cost_estimator.estimate(db, c.id, dtc_entry)
    confidence = engine.confidence_score(posteriors) if posteriors else 0.0
    should_esc, _ = engine.should_escalate(posteriors) if posteriors else (False, "")

    recommended_test = None
    if dtc_entry and session.status == "active":
        recommended_test = engine.select_next_test(dtc_entry, posteriors, completed_test_ids)

    # Cost estimate
    cost_est = None
    if posteriors and dtc_entry:
        top_cause_id, _ = engine.get_top_cause(posteriors)
        cost_est = await cost_estimator.estimate(db, top_cause_id, dtc_entry)

    # Citations
    citations = []
    if dtc_entry:
        rag_service = get_rag_service()
        _, citations = rag_service.retrieve(session.symptom_text, session.dtc_codes)

    logger.info("📋 [TORQ SESSION LOADED] %s | Status: %s | Completed Tests: %d", session.id, session.status, len(completed_tests))

    return SessionState(
        session_id=session.id,
        truck_id=session.truck_id,
        symptom_text=session.symptom_text,
        dtc_codes=session.dtc_codes,
        status=session.status,
        candidate_causes=candidates,
        completed_tests=completed_tests,
        recommended_test=recommended_test,
        confidence_score=confidence,
        should_escalate=should_esc,
        cost_estimate=cost_est,
        citations=citations,
        root_cause=session.root_cause,
    )


# ── Helper functions ─────────────────────────────────────────────────

def _reconstruct_posteriors(
    events: list[SessionEvent],
    dtc_entry: dict[str, Any] | None,
) -> dict[str, float]:
    """Reconstruct the latest posteriors from session events."""
    for event in reversed(events):
        if event.type == "cause_updated" and "posteriors" in event.payload:
            return event.payload["posteriors"]
        if event.type == "result_entered" and "posteriors_after" in event.payload:
            return event.payload["posteriors_after"]
        if event.type == "diagnosis_started" and "priors" in event.payload:
            return event.payload["priors"]
    return {}


def _get_completed_test_ids(events: list[SessionEvent]) -> set[str]:
    """Extract the set of completed test IDs from session events."""
    return {
        event.payload["test_id"]
        for event in events
        if event.type == "result_entered" and "test_id" in event.payload
    }


def _build_completed_tests(events: list[SessionEvent]) -> list[dict[str, Any]]:
    """Build an ordered list of completed tests from session events."""
    tests = []
    for event in events:
        if event.type == "result_entered":
            tests.append({
                "test_id": event.payload.get("test_id"),
                "result": event.payload.get("result"),
                "notes": event.payload.get("notes", ""),
                "timestamp": event.created_at.isoformat() if event.created_at else None,
            })
    return tests


def _build_evidence_log(events: list[SessionEvent]) -> list[dict[str, Any]]:
    """Build evidence log from session events for candidate display."""
    evidence = []
    for event in events:
        if event.type == "result_entered" and event.payload:
            payload = event.payload or {}
            posteriors = payload.get("posteriors_after") or {}
            evidence.append({
                "test_id": payload.get("test_id", ""),
                "result": payload.get("result", ""),
                "affected_causes": list(posteriors.keys()),
            })
    return evidence
