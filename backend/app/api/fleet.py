"""
Fleet Intelligence API routes (Tier 2).
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.fleet_intelligence import FleetIntelligence

router = APIRouter(prefix="/api/fleet", tags=["fleet"])
fleet_intel = FleetIntelligence()


@router.get("/similar-cases")
async def get_similar_cases(
    dtc_code: str = Query(..., description="DTC code to search for"),
    truck_model: str | None = Query(None, description="Filter by truck model"),
    days: int = Query(30, description="Lookback period in days"),
    db: AsyncSession = Depends(get_db),
):
    """Get aggregate statistics for similar historical cases."""
    return await fleet_intel.get_similar_cases(
        db=db,
        dtc_code=dtc_code,
        truck_model=truck_model,
        days=days,
    )
