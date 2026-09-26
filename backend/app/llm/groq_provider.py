"""Groq LLM provider — default provider (Llama 3.3 70B via Groq cloud)."""

from __future__ import annotations

from groq import AsyncGroq

from app.llm.base import LLMProvider


class GroqProvider(LLMProvider):
    """Wraps the Groq SDK for Llama 3.1/3.3 70B inference."""

    def __init__(self, api_key: str, model: str = "llama-3.3-70b-versatile"):
        self._client = AsyncGroq(api_key=api_key)
        self._model = model

    async def complete(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> str:
        response = await self._client.chat.completions.create(
            model=self._model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return response.choices[0].message.content or ""
