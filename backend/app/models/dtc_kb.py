"""DTC Knowledge Base model — stores fault code info and diagnostic procedures."""

from __future__ import annotations

import uuid
from sqlalchemy import String, Text, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class DtcKb(Base):
    __tablename__ = "dtc_kb"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    description: Mapped[str] = mapped_column(Text)
    subsystem: Mapped[str] = mapped_column(String(100))
    possible_causes: Mapped[dict] = mapped_column(JSONB, default=list)
    # Each cause: {"id": str, "name": str, "base_rate": float, "symptom_keywords": [...],
    #              "verified_specs": {"torque_nm": 45, "voltage_v": 12.6, ...}}
    diagnostic_steps: Mapped[dict] = mapped_column(JSONB, default=list)
    # Each step: {"id": str, "description": str, "type": "pass_fail"|"measurement",
    #             "discriminates": [cause_id, ...], "expected_if_cause": {cause_id: "fail"|"high"|...}}
    severity: Mapped[int] = mapped_column(Integer, default=3)
    # 1=info, 2=moderate, 3=warning, 4=critical, 5=stop_vehicle
