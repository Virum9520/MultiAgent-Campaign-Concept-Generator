import logging

from app.models.state import (
    CampaignConcept,
    CampaignState,
    QualityScores,
    TrendItem,
)
from app.services.anthropic_client import call_chat, extract_json

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an award-winning creative director known for breakthrough campaign concepts.

Generate 3-5 distinct campaign concepts. Each concept should be a complete creative idea that could be pitched to a client.

For each concept, output a JSON array of objects with these fields:
- concept_name: A memorable internal name for the concept
- headline: The primary campaign headline (punchy, memorable)
- subheadline: Supporting line that adds context
- visual_description: Detailed description of the key visual/creative treatment
- key_message: The core message consumers should take away
- channels: Array of recommended channels (e.g., "Instagram", "TikTok", "YouTube", "OOH", "TV", "Email")
- content_formats: Array of content types (e.g., "short-form video", "carousel", "interactive story", "UGC campaign")
- call_to_action: The primary CTA
- estimated_reach_tier: "high" | "medium" | "low" based on channel mix and budget

Make each concept distinct in approach — vary the creative strategy, channels, and tone across concepts.

Return ONLY the JSON array, no other text."""


def _format_trends(trends: list[TrendItem]) -> str:
    return "\n".join(
        f"- [{t.category}] {t.title}: {t.summary}" for t in trends
    )


def _format_quality_feedback(scores: list[QualityScores]) -> str:
    lines = ["\n\nPREVIOUS ATTEMPT FEEDBACK — improve on these areas:"]
    for s in scores:
        lines.append(
            f"- Relevance: {s.relevance}/10, Feasibility: {s.feasibility}/10, "
            f"Creativity: {s.creativity}/10, Brand Alignment: {s.brand_alignment}/10"
        )
        lines.append(f"  Feedback: {s.feedback}")
    return "\n".join(lines)


def creative_node(state: CampaignState) -> dict:
    """Generates 3-5 campaign concepts based on strategy and trends."""
    retry_context = ""
    if state.get("quality_scores"):
        retry_context = _format_quality_feedback(state["quality_scores"])

    strategy = state["strategy"]
    user_msg = f"""Brand: {state['brand_name']}
Product: {state['product_description']}
Target Audience: {state['target_audience']}
Budget Tier: {state['budget_tier']}

Strategic Positioning:
- Core Insight: {strategy.core_insight}
- Positioning: {strategy.positioning_statement}
- Key Themes: {', '.join(strategy.key_themes)}
- Emotional Territory: {strategy.emotional_territory}
- Differentiation: {strategy.differentiation_angle}
- Tone: {strategy.recommended_tone}

Trends to Leverage:
{_format_trends(state['trends'])}
{retry_context}"""

    text = call_chat(system=SYSTEM_PROMPT, user_msg=user_msg, max_tokens=4096)

    try:
        raw = extract_json(text)
        concepts = [CampaignConcept(**c) for c in raw]
    except Exception as e:
        logger.error(f"Failed to parse concepts: {e}")
        concepts = []

    is_retry = bool(state.get("quality_scores"))
    retry_count = state.get("retry_count", 0) + (1 if is_retry else 0)

    return {
        "concepts": concepts,
        "current_step": "creative_agent",
        "retry_count": retry_count,
        "messages": [
            {
                "role": "assistant",
                "content": f"[Creative Agent] Generated {len(concepts)} concepts"
                + (f" (retry #{retry_count})" if is_retry else ""),
            }
        ],
    }
