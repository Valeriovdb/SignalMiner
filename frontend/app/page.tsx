"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchOverview, fetchOpportunities } from "@/lib/api";
import { OverviewData, Opportunity, Theme } from "@/lib/types";

// ─── Editorial content ────────────────────────────────────────────────────────

const SYNTHESIS_STATEMENT =
  "Users don't mainly complain about missing metrics — they complain that training data doesn't reliably become useful guidance.";

type AreaType = "trust_risk" | "strategic_opportunity" | "competitive_pressure";

const AREA_CONFIG: Record<string, { type: AreaType; why: string; competitive?: string }> = {
  enhance_training_feedback: {
    type: "strategic_opportunity",
    why: "Garmin collects more data than most platforms, but users struggle to turn that data into training decisions. The gap between data depth and practical guidance is where perceived value is lost.",
    competitive: "COROS and Polar are winning on clarity, not feature breadth.",
  },
  improve_data_sync: {
    type: "trust_risk",
    why: "Sync failures don't just frustrate — they erode the trust that makes premium features worth paying for. This is a hygiene issue with significant trust implications.",
  },
  expand_third_party_integrations: {
    type: "competitive_pressure",
    why: "Integration gaps reduce the perceived completeness of the Garmin ecosystem. As users expect seamless data flow, missing integrations become defection triggers rather than minor inconveniences.",
    competitive: "Apple Health and Strava set high expectations for integration breadth.",
  },
  enhance_performance_analytics: {
    type: "strategic_opportunity",
    why: "Users want analytics that help them make decisions, not just visualize history. Current analytics feel descriptive rather than prescriptive — a significant gap for serious athletes.",
    competitive: "Competitors increasingly frame analytics as coaching, not just reporting.",
  },
};

const AREA_TYPE_CONFIG: Record<AreaType, { label: string; className: string }> = {
  strategic_opportunity: {
    label: "Strategic opportunity",
    className: "bg-violet-500/10 text-violet-400 border-violet-500/30",
  },
  trust_risk: {
    label: "Trust risk",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
  competitive_pressure: {
    label: "Competitive pressure",
    className: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  },
};

const COMPETITIVE_ROWS = [
  {
    dimension: "Coaching clarity",
    garmin: "Metrics-rich, guidance weak",
    competitors: "COROS and Polar offer simpler, clearer interpretation",
    implication: "Expectation gap growing",
    hot: true,
  },
  {
    dimension: "Sync reliability",
    garmin: "Known recurring pain",
    competitors: "Table stakes across platforms",
    implication: "Trust risk, not differentiator",
    hot: true,
  },
  {
    dimension: "Third-party integrations",
    garmin: "Gaps with key tools",
    competitors: "Apple Health sets broad integration expectations",
    implication: "Ecosystem lock-in weakening",
    hot: true,
  },
  {
    dimension: "Data trust & accuracy",
    garmin: "Accuracy questioned on key metrics",
    competitors: "Cross-platform issue, but Garmin is primary target",
    implication: "Undermines premium positioning",
    hot: false,
  },
  {
    dimension: "Subscription / value",
    garmin: "Connect+ friction emerging",
    competitors: "Strava model sets negative expectations",
    implication: "Perceived value exchange at risk",
    hot: false,
  },
];

const EVIDENCE_INSIGHTS = [
  "Garmin's trust problem appears to come less from missing data and more from unclear or inconsistent interpretation of that data.",
  "Sync and integration friction reduce the value of the broader device ecosystem — they don't just annoy users, they undermine Garmin's core value proposition.",
  "Competitors are shaping expectations around clarity, usability, and coaching guidance — not feature breadth. Garmin's depth advantage is being offset by a usability gap.",
  "Subscription frustration is strongest for Strava, not directly for Garmin — but it clarifies what users are sensitive to when evaluating perceived value exchange.",
  "Cross-platform signals suggest coaching recommendations and data accuracy are concerns shared across fitness platforms, but Garmin is the primary target because of its premium positioning.",
];

const DISCOVERY_QUESTIONS = [
  "Are users dissatisfied with training guidance because recommendations are too generic, too hidden, or too hard to trust?",
  "Which specific sync failures are most associated with frustration or disengagement — and are they hardware, software, or ecosystem issues?",
  "Which third-party integrations most influence perceived ecosystem completeness for serious athletes vs. casual users?",
  "Where exactly does Garmin's training intelligence feel like a black box — and does that experience vary by user type (coached vs. self-coached)?",
  "Which gaps are true platform weaknesses vs. issues caused by user setup complexity or device configuration?",
];

const ISSUE_TYPE_LABELS: Record<string, string> = {
  missing_capability: "Missing capability",
  poor_actionability: "Poor actionability",
  data_accuracy_trust: "Data accuracy",
  competitive_gap: "Competitive gap",
  workflow_friction: "Workflow friction",
  regression_after_update: "Regression",
  other: "Other",
};

const SURFACE_LABELS: Record<string, string> = {
  training_plans: "Training Plans",
  coaching_recommendations: "Coaching",
  training_load: "Training Load",
  performance_analytics: "Analytics",
  workout_suggestions: "Workouts",
  post_activity_insights: "Post-Activity",
  third_party_integrations: "Integrations",
  competitive_comparison: "Competitive",
  other: "Other",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OverviewPage() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOverview().then(setOverview).catch((e) => setError(e.message));
    fetchOpportunities()
      .then((d) => setOpportunities(d.opportunities ?? []))
      .catch(() => {});
  }, []);

  if (error) return <ErrorState />;
  if (!overview) return <LoadingState />;

  const garminSignals = overview.high_confidence_themes.filter(
    (t) => t.platform === "garmin" || t.platform === "cross_platform"
  );

  const sortedOpportunities = [...opportunities].sort((a, b) => {
    const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
    return (order[a.priority] ?? 1) - (order[b.priority] ?? 1);
  });

  return (
    <div className="space-y-14">

      {/* 1 — Hero */}
      <section className="space-y-3 pt-2">
        <p className="text-xs text-slate-500 uppercase tracking-widest">
          Training Intelligence Gap · Garmin
        </p>
        <h1 className="text-2xl font-semibold text-white leading-snug max-w-2xl">
          {SYNTHESIS_STATEMENT}
        </h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span>{overview.meta.total_items.toLocaleString()} feedback items</span>
          <span className="text-slate-700">·</span>
          <span>Google Play · Reddit · Garmin Forums</span>
          <span className="text-slate-700">·</span>
          <span>
            Analyzed{" "}
            {new Date(overview.meta.generated_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="text-slate-700">·</span>
          <span>{overview.theme_count} recurring themes · {overview.opportunity_count} opportunity areas</span>
        </div>
      </section>

      {/* 2 — Priority Areas */}
      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Priority areas</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked by signal strength and strategic implication — not confirmed issues or roadmap commitments
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sortedOpportunities.map((opp) => (
            <PriorityAreaCard key={opp.opportunity_id} opp={opp} />
          ))}
        </div>
      </section>

      {/* 3 — Competitive Context */}
      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Competitive context</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Where competitor patterns are relevant to the product problem
          </p>
        </div>
        <CompetitiveContextTable />
      </section>

      {/* 4 — What the Evidence Suggests */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-white">What the evidence suggests</h2>
        <ol className="space-y-3">
          {EVIDENCE_INSIGHTS.map((insight, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-slate-700 text-xs mt-0.5 shrink-0 tabular-nums w-4">{i + 1}.</span>
              <p className="text-sm text-slate-300 leading-relaxed">{insight}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 5 — Top Signals */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Top signals</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              High-confidence themes from Garmin and cross-platform data
            </p>
          </div>
          <Link
            href="/themes"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            All {overview.theme_count} themes →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {garminSignals.slice(0, 6).map((theme) => (
            <SignalCard key={theme.theme_id} theme={theme} />
          ))}
        </div>
      </section>

      {/* 6 — Questions for Discovery */}
      <section className="space-y-4 pb-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Questions for discovery</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Investigation prompts for PMs and stakeholders — not solutions
          </p>
        </div>
        <div className="space-y-2">
          {DISCOVERY_QUESTIONS.map((q, i) => (
            <div
              key={i}
              className="flex gap-3 rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3"
            >
              <span className="text-slate-600 text-xs mt-0.5 shrink-0 font-mono tabular-nums">
                Q{i + 1}
              </span>
              <p className="text-sm text-slate-300">{q}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PriorityAreaCard({ opp }: { opp: Opportunity }) {
  const config = AREA_CONFIG[opp.opportunity_id];
  const type: AreaType = config?.type ?? "strategic_opportunity";
  const typeConfig = AREA_TYPE_CONFIG[type];

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium text-white leading-snug">{opp.opportunity_name}</h3>
        <span
          className={`shrink-0 text-xs px-2 py-0.5 rounded border whitespace-nowrap ${typeConfig.className}`}
        >
          {typeConfig.label}
        </span>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        {config?.why ?? opp.user_problem}
      </p>

      {config?.competitive && (
        <p className="text-xs text-slate-500 border-l border-slate-700 pl-3 italic">
          {config.competitive}
        </p>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
        <span className="text-xs text-slate-600">
          {opp.confidence === "high" ? "Strong signal" : "Moderate signal"}
        </span>
        <span className="text-xs text-slate-600">
          {opp.linked_theme_ids.length} linked {opp.linked_theme_ids.length === 1 ? "theme" : "themes"}
        </span>
      </div>
    </div>
  );
}

function CompetitiveContextTable() {
  return (
    <div className="rounded-lg border border-slate-800 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/60">
            <th className="text-left px-4 py-2.5 text-xs text-slate-500 font-medium w-40">
              Dimension
            </th>
            <th className="text-left px-4 py-2.5 text-xs text-slate-500 font-medium">Garmin</th>
            <th className="text-left px-4 py-2.5 text-xs text-slate-500 font-medium hidden md:table-cell">
              Competitor pressure
            </th>
            <th className="text-left px-4 py-2.5 text-xs text-slate-500 font-medium hidden lg:table-cell">
              Implication
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {COMPETITIVE_ROWS.map((row) => (
            <tr key={row.dimension} className="hover:bg-slate-800/20 transition-colors">
              <td className="px-4 py-3">
                <span className="text-xs font-medium text-slate-300">{row.dimension}</span>
              </td>
              <td className="px-4 py-3">
                <span className="text-xs text-slate-400">{row.garmin}</span>
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <span className="text-xs text-slate-400">{row.competitors}</span>
              </td>
              <td className="px-4 py-3 hidden lg:table-cell">
                <span
                  className={`text-xs ${row.hot ? "text-amber-400" : "text-slate-500"}`}
                >
                  {row.implication}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SignalCard({ theme }: { theme: Theme }) {
  const severityColor: Record<string, string> = {
    high: "text-red-400",
    medium: "text-amber-400",
    low: "text-slate-500",
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium text-white leading-snug">{theme.theme_name}</h3>
        {theme.competitive_signal && (
          <span className="shrink-0 text-xs px-1.5 py-0.5 rounded border bg-orange-500/10 text-orange-400 border-orange-500/30 whitespace-nowrap">
            Competitive
          </span>
        )}
      </div>
      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{theme.user_impact}</p>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 pt-1">
        <span className="text-xs text-slate-600">{SURFACE_LABELS[theme.surface] ?? theme.surface}</span>
        <span className="text-slate-700 text-xs">·</span>
        <span className={`text-xs ${severityColor[theme.severity] ?? "text-slate-500"}`}>
          {theme.severity} severity
        </span>
        <span className="text-slate-700 text-xs">·</span>
        <span className="text-xs text-slate-600">
          {ISSUE_TYPE_LABELS[theme.issue_type] ?? theme.issue_type}
        </span>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-slate-500 text-sm">Loading...</p>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <p className="text-slate-400 text-sm">Unable to load data.</p>
        <p className="text-slate-600 text-xs mt-1">Please try refreshing the page.</p>
      </div>
    </div>
  );
}
