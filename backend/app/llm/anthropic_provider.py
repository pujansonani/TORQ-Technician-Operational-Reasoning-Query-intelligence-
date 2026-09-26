"""Anthropic Claude LLM provider — swappable alternate."""

from __future__ import annotations

from anthropic import AsyncAnthropic

from app.llm.base import LLMProvider


class AnthropicProvider(LLMProvider):
    """Wraps the Anthropic SDK for Claude inference."""

    def __init__(self, api_key: str, model: str = "claude-sonnet-4-20250514"):
        self._client = AsyncAnthropic(api_key=api_key)
        self._model = model

    async def complete(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> str:
        response = await self._client.messages.create(
            model=self._model,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return response.content[0].text
