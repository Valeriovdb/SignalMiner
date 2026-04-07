"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchOverview, fetchOpportunities } from "@/lib/api";
import { OverviewData, Opportunity } from "@/lib/types";
import { MetadataRow } from "@/components/MetadataRow";
import { ScoreExplanation } from "@/components/ScoreExplanation";

// ─── Editorial content ────────────────────────────────────────────────────────

const SYNTHESIS_STATEMENT =
  "The primary user frustration isn't missing data, but the lack of clear, actionable guidance derived from that data.";

const KEY_PATTERNS = [
  {
    title: "Interpretability Gap",
    description: "Garmin collects industry-leading data, but users struggle to translate metrics into training decisions.",
    evidence: "Based on 420+ mentions across 3 sources"
  },
  {
    title: "Ecosystem Trust",
    description: "Sync reliability and data accuracy are the foundation of premium value. Friction here causes immediate defection signals.",
    evidence: "Top recurring pain in Garmin Forums"
  },
  {
    title: "Competitive Clarity",
    description: "COROS and Polar are winning on simplicity and interpretation, not feature breadth.",
    evidence: "Strong signal in cross-platform comparisons"
  }
];

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

  const topPriorities = opportunities
    .sort((a, b) => {
      const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
      return (order[a.priority] ?? 1) - (order[b.priority] ?? 1);
    })
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto space-y-16">

      {/* Hero Section */}
      <section className="space-y-6">
        <h1 className="text-4xl font-semibold text-slate-900 leading-tight tracking-tight">
          {SYNTHESIS_STATEMENT}
        </h1>
        
        <MetadataRow 
          itemCount={overview.meta.total_items}
          sourceTypes={["Google Play", "Reddit", "Garmin Forums"]}
          timeRange="Last 90 days"
          lastUpdated={new Date(overview.meta.generated_at).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric"
          })}
        />
      </section>

      {/* Main Patterns */}
      <section className="space-y-8">
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          Core Patterns
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {KEY_PATTERNS.map((pattern) => (
            <div key={pattern.title} className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-900">{pattern.title}</h3>
              <p className="text-[14px] text-slate-600 leading-relaxed">
                {pattern.description}
              </p>
              <p className="text-[11px] text-slate-400 italic font-medium">
                {pattern.evidence}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Priority Problems */}
      <section className="space-y-8">
        <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Top Priority Problems
          </h2>
          <Link href="/opportunities" className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider transition-colors">
            View all {overview.opportunity_count} areas →
          </Link>
        </div>
        
        <div className="space-y-1">
          {topPriorities.map((opp, i) => (
            <div key={opp.opportunity_id} className="group flex items-start gap-8 py-6 transition-colors hover:bg-slate-50/50 rounded-lg -mx-4 px-4">
              <span className="text-xl font-bold text-slate-200 tabular-nums pt-1 select-none">
                0{i + 1}
              </span>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{opp.opportunity_name}</h3>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold uppercase tracking-wider ${
                    opp.priority === "high" ? "bg-red-50 text-red-700 border-red-200" : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>
                    {opp.priority} priority
                  </span>
                </div>
                <p className="text-[15px] text-slate-600 leading-relaxed max-w-2xl">
                  {opp.user_problem}
                </p>
                <div className="flex gap-4 text-[12px] text-slate-400 font-medium">
                   <span>{opp.linked_theme_ids.length} supporting themes</span>
                   <span className="before:content-['•'] before:mr-4">High business relevance</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Methodology */}
      <section className="space-y-6 pt-8 border-t border-slate-100">
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          Trust & Methodology
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ScoreExplanation 
            label="ranked" 
            explanation="Prioritization is calculated by combining mention volume (frequency), user sentiment (severity), and cross-source consistency (confidence)."
          />
          <ScoreExplanation 
            label="analyzed" 
            explanation="Our pipeline ingests raw feedback, normalizes it across platforms, and uses thematic clustering to identify recurring pain points without manual bias."
          />
        </div>
      </section>

    </div>
  );
}

// ─── States ───────────────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="space-y-3 text-center">
        <div className="animate-spin w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full mx-auto" />
        <p className="text-slate-400 text-sm font-medium italic">Loading analysis...</p>
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex items-center justify-center h-64 border-2 border-dashed border-slate-100 rounded-xl">
      <div className="text-center">
        <p className="text-slate-400 text-sm font-semibold">Unable to load data.</p>
        <p className="text-slate-500 text-xs mt-1">Please try refreshing the page.</p>
      </div>
    </div>
  );
}
