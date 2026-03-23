from __future__ import annotations

from typing import Annotated, TypedDict

from langgraph.graph.message import add_messages
from pydantic import BaseModel, Field


class TrendItem(BaseModel):
    title: str
    summary: str
    source: str
    relevance_score: float = Field(ge=0, le=1)
    category: str  # "social_media" | "industry" | "cultural"


class StrategicPositioning(BaseModel):
    core_insight: str
    positioning_statement: str
    key_themes: list[str]
    emotional_territory: str
    differentiation_angle: str
    recommended_tone: str


class CampaignConcept(BaseModel):
    concept_name: str
    headline: str
    subheadline: str
    visual_description: str
    key_message: str
    channels: list[str]
    content_formats: list[str]
    call_to_action: str
    estimated_reach_tier: str


class QualityScores(BaseModel):
    relevance: float = Field(ge=0, le=10)
    feasibility: float = Field(ge=0, le=10)
    creativity: float = Field(ge=0, le=10)
    brand_alignment: float = Field(ge=0, le=10)
    overall: float = Field(ge=0, le=10)
    feedback: str
    passed: bool


class CampaignState(TypedDict):
    """LangGraph state that flows through the entire pipeline."""

    # Input
    brand_name: str
    product_description: str
    target_audience: str
    industry: str
    campaign_goals: list[str]
    budget_tier: str
    additional_context: str

    # Trend Agent output
    trends: list[TrendItem]

    # Strategy Agent output
    strategy: StrategicPositioning | None

    # Creative Agent output
    concepts: list[CampaignConcept]

    # Quality Gate output
    quality_scores: list[QualityScores]
    passed_quality: bool

    # Pipeline metadata
    current_step: str
    retry_count: int
    error: str | None

    # Message history
    messages: Annotated[list, add_messages]
