"""Truck API routes."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.truck import Truck
from app.schemas.truck import TruckOut, TruckBrief

import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/trucks", tags=["trucks"])


@router.get("", response_model=list[TruckBrief])
async def list_trucks(db: AsyncSession = Depends(get_db)):
    """List all trucks in the fleet."""
    result = await db.execute(select(Truck).order_by(Truck.brand, Truck.model))
    trucks = result.scalars().all()
    logger.info("🚛 [FLEET ACCESSED] Returned %d vehicles from database", len(trucks))
    return trucks


@router.get("/{truck_id}", response_model=TruckOut)
async def get_truck(truck_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Get full details for a single truck."""
    result = await db.execute(select(Truck).where(Truck.id == truck_id))
    truck = result.scalar_one_or_none()
    if not truck:
        raise HTTPException(status_code=404, detail="Truck not found")
    return truck
