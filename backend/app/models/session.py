"""Diagnostic session model — tracks a single diagnostic workflow."""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import String, Text, ForeignKey, Uuid, JSON, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Session(Base):
    __tablename__ = "sessions"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    truck_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("trucks.id"), index=True
    )
    symptom_text: Mapped[str] = mapped_column(Text)
    dtc_codes: Mapped[list[str]] = mapped_column(JSON, default=list)
    status: Mapped[str] = mapped_column(
        String(20), default="active"
    )  # active | resolved | escalated
    root_cause: Mapped[str | None] = mapped_column(String(200), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )

    events = relationship("SessionEvent", back_populates="session", order_by="SessionEvent.created_at")
