"""Part model — parts catalog with pricing."""

from __future__ import annotations

import uuid
from sqlalchemy import String, Numeric, Text, Uuid, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Part(Base):
    __tablename__ = "parts"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    part_number: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    description: Mapped[str] = mapped_column(Text)
    price: Mapped[float] = mapped_column(Numeric(10, 2))
    compatible_models: Mapped[list[str]] = mapped_column(JSON, default=list)
