"""Session schemas."""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel


class SessionEventOut(BaseModel):
    id: uuid.UUID
    type: str
    payload: dict[str, Any]
    created_at: datetime

    model_config = {"from_attributes": True}


class SessionOut(BaseModel):
    id: uuid.UUID
    truck_id: uuid.UUID
    symptom_text: str
    dtc_codes: list[str]
    status: str
    root_cause: str | None = None
    created_at: datetime
    events: list[SessionEventOut] = []

    model_config = {"from_attributes": True}
