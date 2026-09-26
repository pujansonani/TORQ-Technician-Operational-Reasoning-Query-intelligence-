"""
Abstract LLM provider protocol.

All providers must implement this interface so business logic never
depends on a specific LLM vendor.
"""

from __future__ import annotations

import json
from abc import ABC, abstractmethod
from typing import Any


class LLMProvider(ABC):
    """Provider-agnostic LLM interface."""

    @abstractmethod
    async def complete(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> str:
        """Return raw text completion."""
        ...

    async def complete_json(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.1,
        max_tokens: int = 2048,
    ) -> dict[str, Any]:
        """Return a parsed JSON completion. Raises ValueError on bad JSON."""
        raw = await self.complete(
            system_prompt=system_prompt + "\n\nRespond ONLY with valid JSON, no markdown fences.",
            user_prompt=user_prompt,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        # Strip markdown fences if the model wraps anyway
        cleaned = raw.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("\n", 1)[1] if "\n" in cleaned else cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError as exc:
            raise ValueError(f"LLM returned invalid JSON: {raw[:300]}") from exc
