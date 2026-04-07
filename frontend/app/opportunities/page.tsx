"use client";

import { useEffect, useState } from "react";
import { fetchOpportunities } from "@/lib/api";
import { Opportunity } from "@/lib/types";
import { SignalBadge } from "@/components/SignalBadge";
import { ThemeCard } from "@/components/ThemeCard";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { STRATEGIC_RELEVANCE_LABELS } from "@/lib/constants";
import { ScoreExplanation } from "@/components/ScoreExplanation";
import Link from "next/link";

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOpportunities()
      .then((data) => setOpportunities(data.opportunities))
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-slate-500 text-sm py-8 text-center font-medium">Unable to load opportunities. Please refresh.</p>;

  const sorted = [...opportunities].sort(
    (a, b) => (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="space-y-1 border-b border-slate-100 pb-8">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Opportunity Areas</h1>
        <p className="text-slate-500 text-sm">
          High-level problem areas derived from recurring signal clusters. Use these to define discovery focus.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {sorted.map((opp, i) => (
          <div key={opp.opportunity_id} className="space-y-6">
            <div className="flex items-start gap-6">
               <span className="text-2xl font-bold text-slate-100 tabular-nums select-none pt-1">
                 {String(i + 1).padStart(2, '0')}
               </span>
               <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <SignalBadge level={opp.priority} prefix="Priority:" />
                    <SignalBadge level={opp.confidence} prefix="Confidence:" />
                  </div>
                  
                  <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
                    {opp.opportunity_name}
                  </h2>
                  
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {opp.user_problem}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-2">
                       <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Why Now</h3>
                       <p className="text-[14px] text-slate-700 leading-relaxed">
                         {opp.why_now}
                       </p>
                    </div>
                    <div className="space-y-2 border-l border-slate-100 pl-8">
                       <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Business Implication</h3>
                       <div className="flex flex-wrap gap-1.5 pt-1">
                        {opp.expected_business_impact?.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[10px] font-bold uppercase tracking-wider border-slate-200 text-slate-500 bg-slate-50 px-2 py-0.5">
                            {STRATEGIC_RELEVANCE_LABELS[tag] ?? tag}
                          </Badge>
                        ))}
                       </div>
                    </div>
                  </div>

                  {opp.competitive_context && (
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 space-y-1">
                      <h3 className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Competitive Context</h3>
                      <p className="text-[13px] text-amber-900 leading-relaxed italic">
                        {opp.competitive_context}
                      </p>
                    </div>
                  )}

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-3">
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Suggested Discovery Direction</h3>
                    <p className="text-[14px] text-slate-800 leading-relaxed font-medium">
                      {opp.suggested_product_direction}
                    </p>
                  </div>

                  {opp.linked_theme_objects && opp.linked_theme_objects.length > 0 && (
                    <div className="pt-4 space-y-3">
                      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Based on {opp.linked_theme_objects.length} supporting themes</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {opp.linked_theme_objects.map((theme) => (
                          <Link key={theme.theme_id} href={`/themes?selected=${theme.theme_id}`}>
                            <div className="p-3 border border-slate-100 rounded-md hover:border-slate-300 transition-colors group">
                               <p className="text-[13px] font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{theme.theme_name}</p>
                               <p className="text-[11px] text-slate-400 mt-0.5">{theme.evidence?.length ?? 0} items analyzed</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
               </div>
            </div>
            {i < sorted.length - 1 && <Separator className="bg-slate-100 mt-12" />}
          </div>
        ))}
      </div>

      <section className="pt-12 border-t border-slate-100">
        <ScoreExplanation 
          label="prioritized"
          explanation="Priority is determined by cross-referencing user pain severity, mention frequency, and strategic alignment with business goals (e.g., retention, premium conversion)."
        />
      </section>
    </div>
  );
}
