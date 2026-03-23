from pydantic import BaseModel


class CampaignRequest(BaseModel):
    brand_name: str
    product_description: str
    target_audience: str
    industry: str
    campaign_goals: list[str]
    budget_tier: str = "medium"
    additional_context: str | None = None
