export const PLATFORM_LABELS: Record<string, string> = {
  garmin: "Garmin",
  polar: "Polar",
  coros: "COROS",
  strava: "Strava",
  cross_platform: "Cross-Platform",
  general: "General",
};

export const PLATFORM_COLORS: Record<string, string> = {
  garmin: "bg-blue-50 text-blue-700 border-blue-200",
  polar: "bg-red-50 text-red-700 border-red-200",
  coros: "bg-cyan-50 text-cyan-700 border-cyan-200",
  strava: "bg-orange-50 text-orange-700 border-orange-200",
  cross_platform: "bg-violet-50 text-violet-700 border-violet-200",
  general: "bg-slate-50 text-slate-700 border-slate-200",
};

export const TRAINING_SURFACE_LABELS: Record<string, string> = {
  training_plans: "Training Plans",
  coaching_recommendations: "Coaching Recommendations",
  training_load: "Training Load",
  performance_analytics: "Performance Analytics",
  workout_suggestions: "Workout Suggestions",
  post_activity_insights: "Post-Activity Insights",
  third_party_integrations: "Third-Party Integrations",
  competitive_comparison: "Competitive Comparison",
  other: "Other",
};

export const ISSUE_TYPE_LABELS: Record<string, string> = {
  missing_capability: "Missing Capability",
  poor_actionability: "Poor Actionability",
  data_accuracy_trust: "Data Accuracy & Trust",
  competitive_gap: "Competitive Gap",
  workflow_friction: "Workflow Friction",
  regression_after_update: "Regression After Update",
  other: "Other",
};

export const PAIN_TYPE_LABELS: Record<string, string> = {
  missing_capability: "Missing Capability",
  expectation_gap: "Expectation Gap",
  friction: "Friction",
  competitive_defection: "Competitive Defection",
  trust_issue: "Trust Issue",
};

export const STRATEGIC_RELEVANCE_LABELS: Record<string, string> = {
  engagement: "Engagement",
  retention: "Retention",
  trust: "Trust",
  premium_conversion: "Premium Conversion",
  ecosystem_loyalty: "Ecosystem Loyalty",
  churn_risk: "Churn Risk",
  competitive_differentiation: "Competitive Differentiation",
};

export const SOURCE_LABELS: Record<string, string> = {
  google_play: "Google Play",
  reddit: "Reddit",
  garmin_forums: "Garmin Forums",
};
