import logging

from app.models.state import CampaignState, StrategicPositioning, TrendItem
from app.services.anthropic_client import call_chat, extract_json
from app.services.chroma_service import query_similar_campaigns

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a senior brand strategist with 20+ years of experience.

Given current trends and brand context, produce a strategic positioning for the campaign.

Output a JSON object with exactly these fields:
- core_insight: The fundamental human truth or market insight this campaign leverages
- positioning_statement: A clear positioning statement for the campaign
- key_themes: Array of 3-5 thematic pillars
- emotional_territory: The emotional space the campaign should own
- differentiation_angle: What makes this approach unique vs competitors
- recommended_tone: The voice and tone for all creative executions

Return ONLY the JSON object, no other text."""


def _format_trends(trends: list[TrendItem]) -> str:
    lines = []
    for i, t in enumerate(trends, 1):
        lines.append(f"{i}. [{t.category}] {t.title} (relevance: {t.relevance_score})")
        lines.append(f"   {t.summary}")
    return "\n".join(lines)


def _format_campaigns(campaigns: list[dict]) -> str:
    if not campaigns:
        return "No similar campaigns found in database."
    lines = []
    for i, c in enumerate(campaigns, 1):
        lines.append(f"{i}. {c['document']}")
        if c.get("metadata"):
            meta = c["metadata"]
            lines.append(f"   Industry: {meta.get('industry', 'N/A')}, Audience: {meta.get('audience', 'N/A')}")
    return "\n".join(lines)


def strategy_node(state: CampaignState) -> dict:
    """Analyzes brand + trends to generate strategic positioning."""
    similar = query_similar_campaigns(
        brand=state["brand_name"],
        industry=state["industry"],
        audience=state["target_audience"],
        k=3,
    )

    user_msg = f"""Brand: {state['brand_name']}
Product: {state['product_description']}
Target Audience: {state['target_audience']}
Industry: {state['industry']}
Campaign Goals: {', '.join(state['campaign_goals'])}
Budget Tier: {state['budget_tier']}

Current Trends:
{_format_trends(state['trends'])}

Similar Successful Campaigns (for reference):
{_format_campaigns(similar)}

{f"Additional Context: {state['additional_context']}" if state.get('additional_context') else ""}"""

    text = call_chat(system=SYSTEM_PROMPT, user_msg=user_msg, max_tokens=2048)

    try:
        raw = extract_json(text)
        strategy = StrategicPositioning(**raw)
    except Exception as e:
        logger.error(f"Failed to parse strategy: {e}")
        strategy = StrategicPositioning(
            core_insight="Unable to generate insight",
            positioning_statement="Error in strategy generation",
            key_themes=["N/A"],
            emotional_territory="N/A",
            differentiation_angle="N/A",
            recommended_tone="N/A",
        )

    return {
        "strategy": strategy,
        "current_step": "strategy_agent",
        "messages": [
            {
                "role": "assistant",
                "content": f"[Strategy Agent] Positioning: {strategy.positioning_statement[:100]}...",
            }
        ],
    }
