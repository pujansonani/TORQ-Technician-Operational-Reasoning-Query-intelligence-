"""Session event model — immutable log of every action in a diagnostic session."""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import String, ForeignKey, Uuid, JSON, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class SessionEvent(Base):
    __tablename__ = "session_events"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    session_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("sessions.id"), index=True
    )
    type: Mapped[str] = mapped_column(String(30))
    # type ∈ {test_recommended, result_entered, cause_updated, diagnosis_started, diagnosis_resolved}
    payload: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )

    session = relationship("Session", back_populates="events")
