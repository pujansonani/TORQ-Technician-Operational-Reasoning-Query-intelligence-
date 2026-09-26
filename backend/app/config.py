"""
TORQ Configuration — loads all settings from environment variables.

Fails with clear error messages if required variables are missing.
"""

from __future__ import annotations

import sys
from typing import Literal

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application-wide settings, loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── App ────────────────────────────────────────────────────────────
    app_name: str = "TORQ — AI Diagnostic Copilot"
    debug: bool = False
    cors_origins: str = "http://localhost:3000"

    # ── Database (PostgreSQL or SQLite fallback) ──────────────────────
    database_url: str = Field(
        default="sqlite+aiosqlite:///torq.db",
        description=(
            "Async DB connection string. Defaults to local SQLite (sqlite+aiosqlite:///torq.db). "
            "For PostgreSQL / Supabase / Docker: postgresql+asyncpg://user:pass@host:5432/dbname"
        ),
    )

    # ── LLM Provider ──────────────────────────────────────────────────
    llm_provider: Literal["groq", "anthropic", "openai"] = Field(
        default="groq",
        description="Which LLM provider to use. Set via LLM_PROVIDER env var.",
    )
    groq_api_key: str | None = None
    anthropic_api_key: str | None = None
    openai_api_key: str | None = None

    # ── LLM Model names (overridable) ─────────────────────────────────
    groq_model: str = "openai/gpt-oss-120b"
    anthropic_model: str = "claude-sonnet-4-20250514"
    openai_model: str = "gpt-4o"

    # ── Embeddings ────────────────────────────────────────────────────
    embedding_model: str = "all-MiniLM-L6-v2"
    chroma_persist_dir: str = "./chroma_db"

    # ── RAG settings ──────────────────────────────────────────────────
    rag_top_k: int = 5

    # ── Diagnostic engine ─────────────────────────────────────────────
    confidence_escalation_threshold: float = 40.0

    @model_validator(mode="after")
    def validate_llm_key_present(self) -> "Settings":
        """Ensure the API key for the selected LLM provider is set."""
        key_map = {
            "groq": self.groq_api_key,
            "anthropic": self.anthropic_api_key,
            "openai": self.openai_api_key,
        }
        key = key_map.get(self.llm_provider)
        if not key:
            env_name = f"{self.llm_provider.upper()}_API_KEY"
            print(
                f"\n❌  TORQ startup error: LLM_PROVIDER is set to "
                f"'{self.llm_provider}', but {env_name} is not set.\n"
                f"   → Set {env_name} in your .env file or environment.\n",
                file=sys.stderr,
            )
            raise ValueError(
                f"{env_name} is required when LLM_PROVIDER={self.llm_provider}"
            )
        return self


def get_settings() -> Settings:
    """Singleton-ish settings loader (cached by lru_cache in FastAPI dep)."""
    return Settings()  # type: ignore[call-arg]
