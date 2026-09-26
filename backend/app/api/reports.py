"""
Report API routes — export diagnostic session reports.
"""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import PlainTextResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.session import Session
from app.models.truck import Truck
from app.schemas.report import ReportData
from app.services.report_generator import ReportGenerator
from app.services.cost_estimator import CostEstimator
from app.services.diagnostic_engine import DiagnosticEngine
from app.models.dtc_kb import DtcKb

router = APIRouter(prefix="/api/sessions", tags=["reports"])
report_gen = ReportGenerator()
cost_estimator = CostEstimator()
engine = DiagnosticEngine()


@router.get("/{session_id}/report", response_class=PlainTextResponse)
async def get_report(
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Generate a Markdown diagnostic report for the session.
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

    # Load truck
    truck_result = await db.execute(select(Truck).where(Truck.id == session.truck_id))
    truck = truck_result.scalar_one_or_none()
    if not truck:
        raise HTTPException(status_code=404, detail="Truck not found")

    # Build test list from events
    tests_performed = []
    for event in session.events:
        if event.type == "result_entered":
            tests_performed.append({
                "test_id": event.payload.get("test_id"),
                "description": event.payload.get("test_id", "Unknown test"),
                "result": event.payload.get("result"),
                "notes": event.payload.get("notes", ""),
            })

    # Get cost estimate if resolved
    cost_data = None
    confidence = 0.0
    if session.root_cause and session.dtc_codes:
        primary_dtc = session.dtc_codes[0]
        dtc_result = await db.execute(select(DtcKb).where(DtcKb.code == primary_dtc))
        dtc_obj = dtc_result.scalar_one_or_none()
        if dtc_obj:
            dtc_entry = {
                "possible_causes": dtc_obj.possible_causes,
                "diagnostic_steps": dtc_obj.diagnostic_steps,
            }
            # Find cause ID from name
            cause_id = None
            for c in dtc_obj.possible_causes:
                if c["name"] == session.root_cause:
                    cause_id = c["id"]
                    break
            if cause_id:
                cost_est = await cost_estimator.estimate(db, cause_id, dtc_entry, truck.model)
                cost_data = cost_est.model_dump()

            # Reconstruct confidence
            for event in reversed(session.events):
                if event.type == "cause_updated" and "confidence_score" in event.payload:
                    confidence = event.payload["confidence_score"]
                    break

    report_data = ReportData(
        session_id=session.id,
        truck_vin=truck.vin,
        truck_brand=truck.brand,
        truck_model=truck.model,
        truck_year=truck.year,
        symptom_text=session.symptom_text,
        dtc_codes=session.dtc_codes,
        tests_performed=tests_performed,
        root_cause=session.root_cause,
        confidence_score=confidence,
        cost_estimate=cost_data,
        created_at=session.created_at,
    )

    markdown = report_gen.generate_markdown(report_data)
    return PlainTextResponse(content=markdown, media_type="text/markdown")
