"""Truck model — represents a vehicle in the fleet."""


from __future__ import annotations

import uuid
from sqlalchemy import String, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Truck(Base):
    __tablename__ = "trucks"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    vin: Mapped[str] = mapped_column(String(17), unique=True, index=True)
    brand: Mapped[str] = mapped_column(String(50))
    model: Mapped[str] = mapped_column(String(100))
    year: Mapped[int] = mapped_column(Integer)
    engine: Mapped[str] = mapped_column(String(100))
    mileage_km: Mapped[int] = mapped_column(Integer, default=0)
