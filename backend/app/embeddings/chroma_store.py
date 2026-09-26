"""
ChromaDB vector store — persisted to local disk.

Manages the 'dtc_procedures' collection for RAG retrieval.
"""

from __future__ import annotations

import logging
from functools import lru_cache
from typing import Any

import chromadb
from chromadb.config import Settings as ChromaSettings

from app.embeddings.embedding_service import get_embedding_service

logger = logging.getLogger(__name__)

COLLECTION_NAME = "dtc_procedures"


class ChromaStore:
    """Manages ChromaDB collections for diagnostic procedure retrieval."""

    def __init__(self, persist_dir: str = "./chroma_data"):
        logger.info("Initializing ChromaDB at '%s'...", persist_dir)
        self._client = chromadb.Client(ChromaSettings(
            persist_directory=persist_dir,
            anonymized_telemetry=False,
            is_persistent=True,
        ))
        self._embedding_service = get_embedding_service()
        self._collection = self._client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"},
        )
        logger.info(
            "ChromaDB ready. Collection '%s' has %d documents.",
            COLLECTION_NAME,
            self._collection.count(),
        )

    def add_documents(
        self,
        ids: list[str],
        documents: list[str],
        metadatas: list[dict[str, Any]] | None = None,
    ) -> None:
        """Add documents with their embeddings to the collection."""
        embeddings = self._embedding_service.embed(documents)
        self._collection.add(
            ids=ids,
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas or [{}] * len(ids),
        )
        logger.info("Added %d documents to ChromaDB.", len(ids))

    def query(
        self,
        query_text: str,
        n_results: int = 5,
        where: dict[str, Any] | None = None,
    ) -> list[dict[str, Any]]:
        """
        Query the collection and return ranked results.

        Returns list of dicts: [{id, document, metadata, distance}, ...]
        """
        query_embedding = self._embedding_service.embed_single(query_text)

        kwargs: dict[str, Any] = {
            "query_embeddings": [query_embedding],
            "n_results": min(n_results, self._collection.count() or 1),
        }
        if where:
            kwargs["where"] = where

        results = self._collection.query(**kwargs)

        # Flatten into list of dicts
        output = []
        for i in range(len(results["ids"][0])):
            output.append({
                "id": results["ids"][0][i],
                "document": results["documents"][0][i],
                "metadata": results["metadatas"][0][i] if results["metadatas"] else {},
                "distance": results["distances"][0][i] if results["distances"] else 0.0,
            })
        return output

    @property
    def count(self) -> int:
        return self._collection.count()


@lru_cache(maxsize=1)
def get_chroma_store() -> ChromaStore:
    """Singleton ChromaDB store."""
    from app.config import get_settings
    settings = get_settings()
    return ChromaStore(persist_dir=settings.chroma_persist_dir)
