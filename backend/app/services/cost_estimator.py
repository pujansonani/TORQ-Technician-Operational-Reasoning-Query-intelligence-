"""
Cost Estimator — calculates repair costs from parts + labor + consumables.
"""

from __future__ import annotations

import logging
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.part import Part
from app.schemas.diagnosis import CostEstimate

logger = logging.getLogger(__name__)

# Default labor rate in INR per hour
DEFAULT_LABOR_RATE = 800.0
DEFAULT_CONSUMABLES_PERCENT = 0.05  # 5% of parts cost


class CostEstimator:
    """Estimates repair costs based on parts, labor, and consumables."""

    def __init__(self, labor_rate: float = DEFAULT_LABOR_RATE):
        self._labor_rate = labor_rate

    async def estimate(
        self,
        db: AsyncSession,
        cause_id: str,
        dtc_entry: dict[str, Any],
        truck_model: str | None = None,
    ) -> CostEstimate:
        """
        Build a cost estimate for a given root cause.

        Looks up required parts from the cause definition, fetches prices
        from the parts table, and adds labor + consumables.
        """
        # Find the cause details
        cause_info = None
        for cause in dtc_entry.get("possible_causes", []):
            if cause["id"] == cause_id:
                cause_info = cause
                break

        if not cause_info:
            return CostEstimate(total=0.0)

        # Get required parts from the cause definition
        required_parts = cause_info.get("required_parts", [])
        # [{"part_number": "...", "quantity": 1}]

        parts_list = []
        parts_total = 0.0

        for rp in required_parts:
            part_number = rp.get("part_number", "")
            quantity = rp.get("quantity", 1)

            # Look up the part in the database
            result = await db.execute(
                select(Part).where(Part.part_number == part_number)
            )
            part = result.scalar_one_or_none()

            if part:
                line_total = float(part.price) * quantity
                parts_list.append({
                    "part_number": part.part_number,
                    "description": part.description,
                    "price": float(part.price),
                    "quantity": quantity,
                    "line_total": line_total,
                })
                parts_total += line_total
            else:
                logger.warning("Part '%s' not found in database", part_number)
                parts_list.append({
                    "part_number": part_number,
                    "description": "Part not found — check catalog",
                    "price": 0.0,
                    "quantity": quantity,
                    "line_total": 0.0,
                })

        # Labor estimate with chassis and engine packaging factors
        base_labor_hours = float(cause_info.get("estimated_labor_hours", 1.5))
        model_str = (truck_model or "").lower()

        # Chassis packaging multipliers:
        # Aerodynamic cowls (T680, 579) require aero fairing and inner shield removal
        # Vocational/heavy-haul (T880, 567) require belly pan and PTO clearance
        # Long-hood conventionals (389, W990) offer open walk-in bay access
        if any(m in model_str for m in ("t680", "579")):
            labor_multiplier = 1.20
            hourly_rate = 880.0
        elif any(m in model_str for m in ("t880", "567")):
            labor_multiplier = 1.25
            hourly_rate = 920.0
        elif any(m in model_str for m in ("389", "w990")):
            labor_multiplier = 1.05
            hourly_rate = 850.0
        else:
            labor_multiplier = 1.0
            hourly_rate = self._labor_rate

        labor_hours = round(base_labor_hours * labor_multiplier, 1)
        labor_cost = labor_hours * hourly_rate

        # Workshop consumables (O-rings, sealants, threadlocker, HazMat disposal fee)
        consumables = round(max(350.0, parts_total * DEFAULT_CONSUMABLES_PERCENT + (labor_hours * 85.0)), 2)

        total = round(parts_total + labor_cost + consumables, 2)

        return CostEstimate(
            parts=parts_list,
            labor_hours=labor_hours,
            labor_rate_per_hour=hourly_rate,
            consumables=consumables,
            total=total,
        )
