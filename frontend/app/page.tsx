"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchOverview, fetchOpportunities } from "@/lib/api";
import { OverviewData, Opportunity } from "@/lib/types";
import { MetadataRow } from "@/components/MetadataRow";
import { ScoreExplanation } from "@/components/ScoreExplanation";
import { EvidenceQuote } from "@/components/EvidenceQuote";

// ─── Editorial content ────────────────────────────────────────────────────────

const SYNTHESIS_STATEMENT =
  "Main pattern: users struggle more with turning data into guidance than with missing features.";

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

      {/* Section 1 — Main Takeaway */}
      <section className="space-y-6">
        <h1 className="text-3xl font-semibold text-slate-900 leading-tight tracking-tight">
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

      {/* Section 2 — How this was ranked */}
      <section>
        <ScoreExplanation 
          label="ranked" 
          explanation="Priorities are ranked by combining mention volume (Frequency), user sentiment (Severity), and how clearly the problem links to business outcomes (Business relevance). These scores are directional indicators—please inspect the underlying evidence to validate the problem statement."
        />
      </section>

      {/* Section 3 — Top priority areas */}
      <section className="space-y-8">
        <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Top 3 Priority Problems
          </h2>
        </div>
        
        <div className="space-y-1">
          {topPriorities.map((opp, i) => (
            <div key={opp.opportunity_id} className="group py-6 border-b border-slate-50 last:border-0">
              <div className="flex items-start gap-8">
                <span className="text-xl font-bold text-slate-200 tabular-nums pt-1 select-none">
                  0{i + 1}
                </span>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {opp.opportunity_name}
                    </h3>
                  </div>
                  <p className="text-[15px] text-slate-600 leading-relaxed max-w-2xl">
                    {opp.user_problem}
                  </p>
                  <div className="flex gap-4 text-[12px] text-slate-400 font-medium pt-1">
                     <span>{opp.linked_theme_ids.length} linked themes</span>
                     <span className="before:content-['•'] before:mr-4">High business relevance</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4 — Evidence preview */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Evidence Preview
          </h2>
          <Link href="/evidence" className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider transition-colors">
            View all evidence →
          </Link>
        </div>
        
        <div className="space-y-6">
          {/* Note: This is a static preview showing first 3 items from overview evidence, 
              in a real scenario, this would come from a specific evidence endpoint */}
          {overview.high_confidence_themes[0]?.evidence?.slice(0, 3).map((ev) => (
            <EvidenceQuote key={ev.id} evidence={ev} />
          ))}
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
