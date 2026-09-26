"""Truck schemas."""

from __future__ import annotations

import uuid
from pydantic import BaseModel, Field


class TruckOut(BaseModel):
    id: uuid.UUID
    vin: str
    brand: str
    model: str
    year: int
    engine: str
    mileage_km: int

    model_config = {"from_attributes": True}


class TruckBrief(BaseModel):
    """Minimal truck info for dropdowns."""
    id: uuid.UUID
    vin: str
    brand: str
    model: str
    year: int

    model_config = {"from_attributes": True}
