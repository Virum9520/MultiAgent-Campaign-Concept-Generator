import json
import re

from openai import OpenAI

from app.config import get_settings

_client: OpenAI | None = None


def get_client() -> OpenAI:
    global _client
    if _client is None:
        settings = get_settings()
        _client = OpenAI(api_key=settings.openai_api_key)
    return _client


def call_chat(
    system: str,
    user_msg: str,
    model: str | None = None,
    max_tokens: int = 4096,
) -> str:
    """Standard chat completion. Returns the assistant message text."""
    client = get_client()
    settings = get_settings()
    response = client.chat.completions.create(
        model=model or settings.openai_model,
        max_tokens=max_tokens,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user_msg},
        ],
    )
    return response.choices[0].message.content or ""


def call_with_web_search(
    system: str,
    user_msg: str,
    model: str | None = None,
) -> str:
    """Use OpenAI Responses API with web_search_preview tool."""
    client = get_client()
    settings = get_settings()
    response = client.responses.create(
        model=model or settings.openai_model,
        instructions=system,
        tools=[{"type": "web_search_preview"}],
        input=user_msg,
    )
    # Extract text from the response output items
    parts = []
    for item in response.output:
        if item.type == "message":
            for content in item.content:
                if content.type == "output_text":
                    parts.append(content.text)
    return "\n".join(parts)


def extract_json(text: str) -> dict | list:
    """Extract JSON from LLM response text."""
    # Try code fences first
    fence_match = re.search(r"```(?:json)?\s*\n?([\s\S]*?)\n?```", text)
    if fence_match:
        return json.loads(fence_match.group(1))
    # Fall back to finding raw JSON
    for start_char, end_char in [("[", "]"), ("{", "}")]:
        start = text.find(start_char)
        if start != -1:
            end = text.rfind(end_char)
            if end != -1:
                return json.loads(text[start : end + 1])
    raise ValueError("No JSON found in response")
