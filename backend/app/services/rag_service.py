"""
RAG Service — retrieves relevant diagnostic knowledge from ChromaDB.

Assembles context from vector search results for the LLM.
"""

from __future__ import annotations

import logging
from typing import Any

from app.embeddings.chroma_store import get_chroma_store
from app.schemas.diagnosis import SourceCitation

logger = logging.getLogger(__name__)


class RAGService:
    """Retrieval-Augmented Generation service for diagnostic procedures."""

    def __init__(self):
        self._store = get_chroma_store()

    def retrieve(
        self,
        symptom_text: str,
        dtc_codes: list[str],
        top_k: int = 5,
    ) -> tuple[str, list[SourceCitation]]:
        """
        Retrieve relevant procedure chunks for the given symptom + DTCs.

        Returns:
            context_text: Formatted context string for LLM prompt
            citations: List of source citations for the frontend
        """
        # Build query combining symptom and DTC info
        query = f"DTC: {', '.join(dtc_codes)}. Symptom: {symptom_text}"

        results = self._store.query(query_text=query, n_results=top_k)

        if not results:
            logger.warning("No RAG results for query: %s", query[:100])
            return "", []

        # Build context for LLM
        context_parts = []
        citations = []

        for i, result in enumerate(results, 1):
            doc = result["document"]
            meta = result["metadata"]
            distance = result["distance"]
            relevance = max(0.0, 1.0 - distance)  # Convert cosine distance to similarity

            source = meta.get("source", f"KB Document #{i}")
            dtc_code = meta.get("dtc_code", "Unknown")

            context_parts.append(
                f"[Source {i}: {source} (DTC: {dtc_code}, relevance: {relevance:.2f})]\n{doc}\n"
            )
            citations.append(SourceCitation(
                source=source,
                snippet=doc[:300] + ("..." if len(doc) > 300 else ""),
                relevance_score=round(relevance, 3),
            ))

        context_text = "\n---\n".join(context_parts)
        return context_text, citations

    def retrieve_for_dtc(self, dtc_code: str, top_k: int = 3) -> list[dict[str, Any]]:
        """Retrieve chunks specifically for a single DTC code."""
        results = self._store.query(
            query_text=f"DTC fault code {dtc_code} diagnostic procedure",
            n_results=top_k,
        )
        return results


_rag_service: RAGService | None = None


def get_rag_service() -> RAGService:
    """Lazily-initialized singleton RAG service."""
    global _rag_service
    if _rag_service is None:
        _rag_service = RAGService()
    return _rag_service
