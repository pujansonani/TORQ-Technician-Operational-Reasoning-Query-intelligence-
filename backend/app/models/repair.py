"""Repair record model — historical repair data for fleet intelligence."""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import String, Numeric, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY, TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Repair(Base):
    __tablename__ = "repairs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    truck_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("trucks.id"), index=True
    )
    dtc_codes: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    symptom_text: Mapped[str] = mapped_column(Text)
    root_cause: Mapped[str] = mapped_column(String(200))
    parts_used: Mapped[dict] = mapped_column(JSONB, default=list)
    # [{"part_number": "...", "quantity": 1, "unit_price": 1200.0}]
    cost_total: Mapped[float] = mapped_column(Numeric(12, 2))
    labor_hours: Mapped[float] = mapped_column(Numeric(6, 2))
    resolved_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), default=datetime.utcnow
    )
