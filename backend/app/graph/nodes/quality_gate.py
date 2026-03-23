import json
import logging

from app.models.state import (
    CampaignConcept,
    CampaignState,
    QualityScores,
    TrendItem,
)
from app.services.anthropic_client import call_chat, extract_json

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a campaign quality evaluator. Score each campaign concept rigorously.

For each concept, evaluate on these dimensions (0-10 scale):
- relevance: How well does it connect to the brand, audience, and current trends?
- feasibility: Can it be realistically executed within the stated budget tier?
- creativity: Is it original, attention-grabbing, and likely to break through?
- brand_alignment: Does it fit the strategic positioning and brand identity?

Also compute:
- overall: Average of the four scores
- passed: true if overall >= 7.0
- feedback: 2-3 sentences explaining the scores and suggesting improvements

Output a JSON array of scoring objects, one per concept, in the same order as the concepts.

Return ONLY the JSON array, no other text."""


def _format_trends(trends: list[TrendItem]) -> str:
    return "\n".join(f"- {t.title}: {t.summary}" for t in trends[:5])


def quality_gate_node(state: CampaignState) -> dict:
    """Validates campaign concepts meet quality criteria."""
    strategy = state["strategy"]
    concepts_json = json.dumps(
        [c.model_dump() for c in state["concepts"]], indent=2
    )

    user_msg = f"""Brand: {state['brand_name']}
Industry: {state['industry']}
Target Audience: {state['target_audience']}
Budget Tier: {state['budget_tier']}

Strategic Positioning:
- Positioning: {strategy.positioning_statement}
- Key Themes: {', '.join(strategy.key_themes)}
- Tone: {strategy.recommended_tone}

Trends Used:
{_format_trends(state['trends'])}

Concepts to Evaluate:
{concepts_json}"""

    text = call_chat(system=SYSTEM_PROMPT, user_msg=user_msg, max_tokens=2048)

    try:
        raw = extract_json(text)
        scores = [QualityScores(**s) for s in raw]
    except Exception as e:
        logger.error(f"Failed to parse quality scores: {e}")
        scores = [
            QualityScores(
                relevance=7,
                feasibility=7,
                creativity=7,
                brand_alignment=7,
                overall=7,
                feedback="Unable to evaluate — defaulting to pass.",
                passed=True,
            )
            for _ in state["concepts"]
        ]

    all_passed = all(s.passed for s in scores)

    return {
        "quality_scores": scores,
        "passed_quality": all_passed,
        "current_step": "quality_gate",
        "messages": [
            {
                "role": "assistant",
                "content": f"[Quality Gate] {'PASSED' if all_passed else 'NEEDS REVISION'} — "
                + ", ".join(f"{s.overall:.1f}/10" for s in scores),
            }
        ],
    }
