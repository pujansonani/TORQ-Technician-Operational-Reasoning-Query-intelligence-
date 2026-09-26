"""
Fleet Intelligence — aggregate queries over historical repair data.

Tier 2 feature: "N similar cases in last 30 days, X% resolved by Y, avg cost Z"
"""

from __future__ import annotations

import logging
from datetime import datetime, timedelta
from typing import Any

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.repair import Repair

logger = logging.getLogger(__name__)


class FleetIntelligence:
    """Aggregate queries over historical repair data for fleet insights."""

    async def get_similar_cases(
        self,
        db: AsyncSession,
        dtc_code: str,
        truck_model: str | None = None,
        days: int = 30,
    ) -> dict[str, Any]:
        """
        Find similar cases and compute aggregate statistics.

        Returns: {
            "total_cases": int,
            "resolution_breakdown": [{"root_cause": str, "count": int, "percentage": float}],
            "avg_cost": float,
            "avg_labor_hours": float,
        }
        """
        cutoff = datetime.utcnow() - timedelta(days=days)

        # Build query conditions
        conditions = [
            Repair.resolved_at >= cutoff,
            Repair.dtc_codes.any(dtc_code),
        ]

        # Count total similar cases
        count_q = select(func.count(Repair.id)).where(and_(*conditions))
        total = (await db.execute(count_q)).scalar() or 0

        if total == 0:
            return {
                "total_cases": 0,
                "resolution_breakdown": [],
                "avg_cost": 0.0,
                "avg_labor_hours": 0.0,
                "period_days": days,
            }

        # Resolution breakdown
        breakdown_q = (
            select(
                Repair.root_cause,
                func.count(Repair.id).label("count"),
            )
            .where(and_(*conditions))
            .group_by(Repair.root_cause)
            .order_by(func.count(Repair.id).desc())
        )
        breakdown_rows = (await db.execute(breakdown_q)).all()
        resolution_breakdown = [
            {
                "root_cause": row.root_cause,
                "count": row.count,
                "percentage": round(row.count / total * 100, 1),
            }
            for row in breakdown_rows
        ]

        # Average cost and labor
        avg_q = select(
            func.avg(Repair.cost_total).label("avg_cost"),
            func.avg(Repair.labor_hours).label("avg_labor"),
        ).where(and_(*conditions))
        avg_row = (await db.execute(avg_q)).one()

        return {
            "total_cases": total,
            "resolution_breakdown": resolution_breakdown,
            "avg_cost": round(float(avg_row.avg_cost or 0), 2),
            "avg_labor_hours": round(float(avg_row.avg_labor or 0), 1),
            "period_days": days,
        }
