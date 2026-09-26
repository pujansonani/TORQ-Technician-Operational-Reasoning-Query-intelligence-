"""Report schemas."""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel


class ReportData(BaseModel):
    """All data needed to render a diagnostic session report."""
    session_id: uuid.UUID
    truck_vin: str
    truck_brand: str
    truck_model: str
    truck_year: int
    symptom_text: str
    dtc_codes: list[str]
    tests_performed: list[dict[str, Any]]
    root_cause: str | None
    confidence_score: float
    cost_estimate: dict[str, Any] | None
    created_at: datetime
    resolved_at: datetime | None = None
    technician_notes: str = ""
