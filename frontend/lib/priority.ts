import { Theme } from "./types";

export type PriorityLabel = "investigate_now" | "monitor" | "needs_validation";

export function getPriorityLabel(theme: Theme): PriorityLabel {
  if (theme.confidence === "low") return "needs_validation";
  if (
    theme.severity === "high" &&
    (theme.confidence === "medium" || theme.confidence === "high")
  ) {
    return "investigate_now";
  }
  return "monitor";
}

export const PRIORITY_CONFIG: Record<
  PriorityLabel,
  { label: string; className: string; dot: string }
> = {
  investigate_now: {
    label: "Investigate now",
    className: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  monitor: {
    label: "Monitor",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  needs_validation: {
    label: "Needs validation",
    className: "bg-slate-50 text-slate-700 border-slate-200",
    dot: "bg-slate-500",
  },
};

export const DISCOVERY_STEPS: Record<string, string[]> = {
  missing_capability: [
    "User interviews to validate scope and understand workaround behavior",
    "Benchmark against COROS EvoLab and Polar Training Load Pro equivalents",
    "Define what success looks like before exploring solutions",
  ],
  poor_actionability: [
    "Contextual inquiry around post-workout review workflow",
    "Test whether users understand and act on existing recommendations",
    "Jobs-to-be-Done interviews focused on training decisions",
  ],
  data_accuracy_trust: [
    "Audit metric calculation methodology against published standards",
    "Survey to collect user perception data on metric trust",
    "Controlled comparison against reference devices",
  ],
  competitive_gap: [
    "Map the user switching journey end-to-end",
    "Competitive teardown: COROS EvoLab, Polar Training Load Pro, TrainingPeaks",
    "Identify at-risk retention cohort in usage data",
  ],
  workflow_friction: [
    "Task analysis of affected workflow step by step",
    "Usability study with target user segment (coached athletes, self-coached runners)",
    "Review support tickets for scope and frequency signal",
  ],
  regression_after_update: [
    "Identify affected app version and user cohort",
    "Reproduce and escalate to engineering with version delta",
    "Monitor app review trends across version history",
  ],
  other: [
    "Define problem scope before investing in discovery",
    "Qualitative interviews with directly affected user segment",
  ],
};
