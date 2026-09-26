"""
LLM provider factory — reads LLM_PROVIDER env var and returns the correct provider.

Usage:
    provider = get_llm_provider(settings)
    result = await provider.complete_json(system_prompt, user_prompt)
"""

from __future__ import annotations

from functools import lru_cache

from app.config import Settings
from app.llm.base import LLMProvider


@lru_cache(maxsize=1)
def get_llm_provider(provider_name: str | None = None) -> LLMProvider:
    """
    Instantiate and cache the LLM provider based on settings.

    Called with provider_name so lru_cache can work (Settings isn't hashable).
    """
    from app.config import get_settings

    settings = get_settings()
    name = provider_name or settings.llm_provider

    if name == "groq":
        from app.llm.groq_provider import GroqProvider
        return GroqProvider(
            api_key=settings.groq_api_key,  # type: ignore[arg-type]
            model=settings.groq_model,
        )
    elif name == "anthropic":
        from app.llm.anthropic_provider import AnthropicProvider
        return AnthropicProvider(
            api_key=settings.anthropic_api_key,  # type: ignore[arg-type]
            model=settings.anthropic_model,
        )
    elif name == "openai":
        from app.llm.openai_provider import OpenAIProvider
        return OpenAIProvider(
            api_key=settings.openai_api_key,  # type: ignore[arg-type]
            model=settings.openai_model,
        )
    else:
        raise ValueError(
            f"Unknown LLM_PROVIDER '{name}'. "
            f"Valid options: groq, anthropic, openai"
        )
