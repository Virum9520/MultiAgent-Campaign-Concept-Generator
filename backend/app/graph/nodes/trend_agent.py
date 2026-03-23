import logging

from app.models.state import CampaignState, TrendItem
from app.services.anthropic_client import call_with_web_search, extract_json

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a trend research specialist. Your job is to find the most relevant current trends for a brand's campaign.

Use web search to discover 5-8 trends across these categories:
- social_media: Viral content, hashtags, platform-specific trends
- industry: Market shifts, competitor moves, emerging technologies
- cultural: Cultural moments, societal shifts, seasonal events

For each trend, return a JSON array with objects containing:
- title: Short trend name
- summary: 2-3 sentence description
- source: URL where you found this
- relevance_score: 0.0 to 1.0 (how relevant to this specific brand/audience)
- category: "social_media" | "industry" | "cultural"

Return ONLY the JSON array, no other text."""


def trend_node(state: CampaignState) -> dict:
    """Searches the web for trends relevant to the brand and industry."""
    user_msg = (
        f"Brand: {state['brand_name']}\n"
        f"Product: {state['product_description']}\n"
        f"Industry: {state['industry']}\n"
        f"Target Audience: {state['target_audience']}\n"
        f"Campaign Goals: {', '.join(state['campaign_goals'])}\n\n"
        "Search for the latest trends relevant to this brand and audience. "
        "Look at social media trends, industry news, and cultural moments happening right now."
    )

    text = call_with_web_search(system=SYSTEM_PROMPT, user_msg=user_msg)

    try:
        raw_trends = extract_json(text)
        trends = [TrendItem(**t) for t in raw_trends]
    except Exception as e:
        logger.error(f"Failed to parse trends: {e}")
        trends = []

    return {
        "trends": trends,
        "current_step": "trend_agent",
        "messages": [
            {
                "role": "assistant",
                "content": f"[Trend Agent] Found {len(trends)} relevant trends",
            }
        ],
    }
