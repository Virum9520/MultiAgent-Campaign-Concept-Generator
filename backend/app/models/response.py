from pydantic import BaseModel

from app.models.state import (
    CampaignConcept,
    QualityScores,
    StrategicPositioning,
    TrendItem,
)


class CampaignResponse(BaseModel):
    request_id: str
    brand_name: str
    concepts: list[CampaignConcept]
    quality_scores: list[QualityScores]
    strategy: StrategicPositioning
    trends_used: list[TrendItem]


class ProgressEvent(BaseModel):
    step: str
    status: str  # "started" | "completed" | "failed"
    detail: str | None = None
