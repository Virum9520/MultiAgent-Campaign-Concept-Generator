export interface CampaignRequest {
  brand_name: string;
  product_description: string;
  target_audience: string;
  industry: string;
  campaign_goals: string[];
  budget_tier: "low" | "medium" | "high";
  additional_context?: string;
}

export interface TrendItem {
  title: string;
  summary: string;
  source: string;
  relevance_score: number;
  category: "social_media" | "industry" | "cultural";
}

export interface StrategicPositioning {
  core_insight: string;
  positioning_statement: string;
  key_themes: string[];
  emotional_territory: string;
  differentiation_angle: string;
  recommended_tone: string;
}

export interface CampaignConcept {
  concept_name: string;
  headline: string;
  subheadline: string;
  visual_description: string;
  key_message: string;
  channels: string[];
  content_formats: string[];
  call_to_action: string;
  estimated_reach_tier: string;
}

export interface QualityScores {
  relevance: number;
  feasibility: number;
  creativity: number;
  brand_alignment: number;
  overall: number;
  feedback: string;
  passed: boolean;
}

export interface CampaignResponse {
  request_id: string;
  brand_name: string;
  concepts: CampaignConcept[];
  quality_scores: QualityScores[];
  strategy: StrategicPositioning;
  trends_used: TrendItem[];
}

export interface ProgressEvent {
  step: string;
  status: "started" | "completed" | "failed";
  detail?: string;
}
