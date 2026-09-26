"""
TORQ Backend — FastAPI application entry point.

Includes CORS, lifespan management, and all route registrations.
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(name)-30s | %(levelname)-7s | %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup/shutdown lifecycle — pre-warm embeddings and ChromaDB."""
    settings = get_settings()
    logger.info("🔧 TORQ starting up (LLM provider: %s)", settings.llm_provider)

    # Pre-warm embedding model and ChromaDB
    try:
        from app.embeddings.embedding_service import get_embedding_service
        get_embedding_service()
        logger.info("✅ Embedding model loaded")
    except Exception as e:
        logger.warning("⚠️  Embedding model failed to load: %s", e)

    try:
        from app.embeddings.chroma_store import get_chroma_store
        store = get_chroma_store()
        logger.info("✅ ChromaDB ready (%d documents)", store.count)
    except Exception as e:
        logger.warning("⚠️  ChromaDB failed to initialize: %s", e)

    # Pre-warm LLM provider
    try:
        from app.llm import get_llm_provider
        get_llm_provider()
        logger.info("✅ LLM provider initialized")
    except Exception as e:
        logger.warning("⚠️  LLM provider failed to initialize: %s", e)

    logger.info("🚀 TORQ is ready")
    yield
    logger.info("🛑 TORQ shutting down")


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        description="AI Diagnostic Copilot for Truck Service Technicians",
        version="0.1.0",
        lifespan=lifespan,
    )

    # CORS
    origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
    for default_origin in ["http://localhost:3000", "http://127.0.0.1:3000"]:
        if default_origin not in origins:
            origins.append(default_origin)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register routers
    from app.api.trucks import router as trucks_router
    from app.api.diagnosis import router as diagnosis_router
    from app.api.reports import router as reports_router
    from app.api.fleet import router as fleet_router

    app.include_router(trucks_router)
    app.include_router(diagnosis_router)
    app.include_router(reports_router)
    app.include_router(fleet_router)

    @app.get("/health")
    async def health():
        return {"status": "ok", "service": "torq-backend"}

    return app


app = create_app()
