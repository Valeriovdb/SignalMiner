export type SignalLevel = "low" | "medium" | "high";

export type Platform = "garmin" | "polar" | "coros" | "strava" | "cross_platform" | "general";
export type TrainingSurface = "training_plans" | "coaching_recommendations" | "training_load" | "performance_analytics" | "workout_suggestions" | "post_activity_insights" | "third_party_integrations" | "competitive_comparison" | "other";
export type IssueType = "missing_capability" | "poor_actionability" | "data_accuracy_trust" | "competitive_gap" | "workflow_friction" | "regression_after_update" | "other";
export type PainType = "missing_capability" | "expectation_gap" | "friction" | "competitive_defection" | "trust_issue";

export interface Evidence {
  id: string;
  source: string;
  source_label: string;
  platform: Platform;
  platform_label: string;
  date: string | null;
  rating: number | null;
  text: string;
  url: string | null;
  product_reference: string | null;
  theme_id?: string;
  theme_name?: string;
}

export interface Theme {
  theme_id: string;
  theme_name: string;
  summary: string;
  platform: Platform;
  surface: TrainingSurface;
  issue_type: IssueType;
  pain_type: PainType;
  problem_statement: string;
  user_impact: string;
  competitive_signal: boolean;
  competitor_mentioned: string | null;
  aggregated_mentions: number;
  frequency: SignalLevel;
  severity: SignalLevel;
  confidence: SignalLevel;
  strategic_relevance: string[];
  merged_from_theme_ids: string[];
  evidence: Evidence[];
}

export interface Opportunity {
  opportunity_id: string;
  opportunity_name: string;
  user_problem: string;
  why_now: string;
  linked_theme_ids: string[];
  linked_theme_objects?: Theme[];
  competitive_context: string | null;
  expected_business_impact: string[];
  suggested_product_direction: string;
  confidence: SignalLevel;
  priority: SignalLevel;
}

export interface OverviewData {
  meta: {
    generated_at: string;
    total_items: number;
    by_source: Record<string, number>;
    by_platform: Record<string, number>;
  };
  theme_count: number;
  opportunity_count: number;
  competitive_theme_count: number;
  high_confidence_themes: Theme[];
  sources: { key: string; label: string; count: number }[];
  platforms: { key: string; label: string; count: number }[];
  top_insights: string[];
  executive_summary: string;
  competitive_landscape_summary: string;
}
