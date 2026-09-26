"""
Master seed script — loads all seed data into PostgreSQL and ChromaDB.

Usage:
    python -m seed.seed_all
"""

from __future__ import annotations

import asyncio
import json
import logging
import random
import uuid
import sys
import os
from datetime import datetime, timedelta
from pathlib import Path

# Add parent to sys.path so we can import app
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import engine, async_session_factory, Base
from app.models import Truck, DtcKb, Part, Repair

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger(__name__)

SEED_DIR = Path(__file__).parent


async def create_tables():
    """Create all database tables."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("✅ Database tables created")


async def seed_trucks(db: AsyncSession) -> list[Truck]:
    """Seed sample trucks."""
    data = json.loads((SEED_DIR / "trucks_sample.json").read_text())
    trucks = []
    for item in data:
        truck = Truck(**item)
        db.add(truck)
        trucks.append(truck)
    await db.flush()
    logger.info("✅ Seeded %d trucks", len(trucks))
    return trucks


async def seed_parts(db: AsyncSession) -> list[Part]:
    """Seed parts catalog."""
    data = json.loads((SEED_DIR / "parts_prices.json").read_text())
    parts = []
    for item in data:
        part = Part(**item)
        db.add(part)
        parts.append(part)
    await db.flush()
    logger.info("✅ Seeded %d parts", len(parts))
    return parts


async def seed_dtc_kb(db: AsyncSession) -> list[DtcKb]:
    """Seed DTC knowledge base and index into ChromaDB."""
    data = json.loads((SEED_DIR / "dtc_sample.json").read_text())
    dtc_entries = []
    chroma_docs = []
    chroma_ids = []
    chroma_metas = []

    for item in data:
        entry = DtcKb(
            code=item["code"],
            description=item["description"],
            subsystem=item["subsystem"],
            possible_causes=item["possible_causes"],
            diagnostic_steps=item["diagnostic_steps"],
            severity=item["severity"],
        )
        db.add(entry)
        dtc_entries.append(entry)

        # Build documents for ChromaDB
        # One document per DTC with all procedure text
        doc_parts = [
            f"DTC: {item['code']} — {item['description']}",
            f"Subsystem: {item['subsystem']}",
            f"Severity: {item['severity']}/5",
            "",
            "Possible Causes:",
        ]
        for cause in item["possible_causes"]:
            doc_parts.append(f"- {cause['name']}: {cause.get('description', '')}")
            if cause.get("verified_specs"):
                specs = ", ".join(f"{k}: {v}" for k, v in cause["verified_specs"].items())
                doc_parts.append(f"  Verified specs: {specs}")

        doc_parts.append("")
        doc_parts.append("Diagnostic Steps:")
        for step in item["diagnostic_steps"]:
            doc_parts.append(f"- {step['id']}: {step['description']}")

        full_doc = "\n".join(doc_parts)
        chroma_docs.append(full_doc)
        chroma_ids.append(f"dtc_{item['code']}")
        chroma_metas.append({
            "dtc_code": item["code"],
            "subsystem": item["subsystem"],
            "severity": str(item["severity"]),
            "source": f"TORQ Knowledge Base — {item['code']}",
        })

        # Also index each cause as a separate smaller document for finer retrieval
        for cause in item["possible_causes"]:
            cause_doc = (
                f"DTC {item['code']} — Possible cause: {cause['name']}\n"
                f"{cause.get('description', '')}\n"
                f"Keywords: {', '.join(cause.get('symptom_keywords', []))}\n"
            )
            if cause.get("verified_specs"):
                cause_doc += f"Verified specs: {json.dumps(cause['verified_specs'])}\n"
            chroma_docs.append(cause_doc)
            chroma_ids.append(f"dtc_{item['code']}_cause_{cause['id']}")
            chroma_metas.append({
                "dtc_code": item["code"],
                "cause_id": cause["id"],
                "source": f"TORQ KB — {item['code']} — {cause['name']}",
            })

    await db.flush()
    logger.info("✅ Seeded %d DTC knowledge base entries", len(dtc_entries))

    # Index into ChromaDB
    try:
        from app.embeddings.chroma_store import get_chroma_store
        store = get_chroma_store()
        store.add_documents(ids=chroma_ids, documents=chroma_docs, metadatas=chroma_metas)
        logger.info("✅ Indexed %d documents into ChromaDB", len(chroma_docs))
    except Exception as e:
        logger.error("❌ ChromaDB indexing failed: %s", e)

    return dtc_entries


async def seed_repairs(db: AsyncSession, trucks: list[Truck], dtc_entries: list[DtcKb]):
    """Generate 60 synthetic repair records."""

    # Repair templates
    symptoms = [
        "Engine oil pressure warning light came on during highway driving",
        "Low oil pressure reading on dashboard gauge at idle",
        "Oil pressure drops to zero after engine warms up",
        "Engine overheating after 30 minutes of driving",
        "Coolant temperature gauge reading high, no visible leak",
        "Temperature warning and steam from under hood",
        "Engine surging at highway speed, RPM fluctuating",
        "Truck going into limp mode under acceleration",
        "Loss of power on grade, excessive black smoke",
        "DEF warning light on, low SCR efficiency code",
        "Check engine light with DEF system fault",
        "NOx levels high on emissions test",
        "Accelerator pedal intermittently unresponsive",
        "Pedal position sensor fault, limp mode",
        "No throttle response on cold start",
        "DPF pressure reading stuck at zero",
        "DPF regen not completing, soot level high",
        "DPF warning light flashing, forced regen needed",
    ]

    dtc_map = {entry.code: entry for entry in dtc_entries}
    dtc_codes_list = list(dtc_map.keys())

    repairs = []
    for i in range(60):
        truck = random.choice(trucks)
        dtc_code = random.choice(dtc_codes_list)
        dtc = dtc_map[dtc_code]

        # Pick a random cause from this DTC
        cause = random.choice(dtc.possible_causes)
        parts_used = []
        parts_cost = 0.0
        for rp in cause.get("required_parts", []):
            # Simulate price
            price = random.uniform(500, 25000)
            qty = rp.get("quantity", 1)
            parts_used.append({
                "part_number": rp["part_number"],
                "quantity": qty,
                "unit_price": round(price, 2),
            })
            parts_cost += price * qty

        labor_hours = cause.get("estimated_labor_hours", random.uniform(0.5, 6.0))
        labor_cost = labor_hours * 800
        total = parts_cost + labor_cost + (parts_cost * 0.05)  # 5% consumables

        repair = Repair(
            truck_id=truck.id,
            dtc_codes=[dtc_code],
            symptom_text=random.choice(symptoms),
            root_cause=cause["name"],
            parts_used=parts_used,
            cost_total=round(total, 2),
            labor_hours=round(labor_hours, 2),
            resolved_at=datetime.utcnow() - timedelta(days=random.randint(0, 90)),
        )
        db.add(repair)
        repairs.append(repair)

    await db.flush()
    logger.info("✅ Seeded %d synthetic repair records (demo data)", len(repairs))


async def main():
    logger.info("🔧 TORQ Seed Script — Loading demo data...")

    # Create tables
    await create_tables()

    async with async_session_factory() as db:
        try:
            # Check if already seeded
            result = await db.execute(text("SELECT COUNT(*) FROM trucks"))
            truck_count = result.scalar()
            if truck_count and truck_count > 0:
                logger.info("⚠️  Database already seeded (%d trucks found). Skipping.", truck_count)
                return
        except Exception:
            pass  # Tables may not exist yet

        trucks = await seed_trucks(db)
        parts = await seed_parts(db)
        dtc_entries = await seed_dtc_kb(db)
        await seed_repairs(db, trucks, dtc_entries)

        await db.commit()
        logger.info("🎉 All seed data loaded successfully!")


if __name__ == "__main__":
    asyncio.run(main())
