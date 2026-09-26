"""
Local embedding service using sentence-transformers all-MiniLM-L6-v2.

Loaded once at startup, no external API dependency.
"""

from __future__ import annotations

import logging
from functools import lru_cache

from sentence_transformers import SentenceTransformer

logger = logging.getLogger(__name__)


class EmbeddingService:
    """Wraps sentence-transformers for synchronous embedding generation."""

    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        logger.info("Loading embedding model '%s'...", model_name)
        self._model = SentenceTransformer(model_name)
        logger.info("Embedding model loaded.")

    def embed(self, texts: list[str]) -> list[list[float]]:
        """Generate embeddings for a list of texts."""
        embeddings = self._model.encode(texts, convert_to_numpy=True)
        return embeddings.tolist()

    def embed_single(self, text: str) -> list[float]:
        """Generate embedding for a single text."""
        return self.embed([text])[0]


@lru_cache(maxsize=1)
def get_embedding_service() -> EmbeddingService:
    """Singleton embedding service."""
    from app.config import get_settings
    settings = get_settings()
    return EmbeddingService(model_name=settings.embedding_model)
