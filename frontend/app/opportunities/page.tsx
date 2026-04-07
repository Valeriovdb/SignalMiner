"use client";

import { useEffect, useState } from "react";
import { fetchOpportunities } from "@/lib/api";
import { Opportunity } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { STRATEGIC_RELEVANCE_LABELS } from "@/lib/constants";
import { ScoreExplanation } from "@/components/ScoreExplanation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOpportunities()
      .then((data) => setOpportunities(data.opportunities))
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-slate-500 text-sm py-8 text-center font-medium">Unable to load opportunities.</p>;

  const sorted = [...opportunities].sort(
    (a, b) => (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="space-y-4 border-b border-slate-100 pb-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Opportunity Areas</h1>
          <p className="text-slate-500 text-sm">
            Opportunity areas group related themes into broader product problems worth investigating.
          </p>
        </div>
        <ScoreExplanation 
          label="prioritized"
          explanation="Prioritization is calculated by cross-referencing theme frequency, user pain severity, and alignment with business goals like retention and premium value."
        />
      </div>

      <div className="grid grid-cols-1 gap-12">
        {sorted.map((opp, i) => (
          <div key={opp.opportunity_id} className="space-y-6">
            <div className="flex items-start gap-8">
               <span className="text-2xl font-bold text-slate-200 tabular-nums select-none pt-1">
                 {String(i + 1).padStart(2, '0')}
               </span>
               <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-slate-900 tracking-tight">{opp.opportunity_name}</h2>
                    <p className="text-[15px] text-slate-600 leading-relaxed">{opp.user_problem}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Why focus here?</h3>
                       <p className="text-[13px] text-slate-700 leading-relaxed">{opp.why_now}</p>
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Business Implication</h3>
                       <p className="text-[13px] text-slate-700 leading-relaxed italic">{opp.suggested_product_direction}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {opp.expected_business_impact?.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[10px] font-bold uppercase tracking-wider border-slate-200 text-slate-500 bg-slate-50 px-2 py-0.5">
                        {STRATEGIC_RELEVANCE_LABELS[tag] ?? tag}
                      </Badge>
                    ))}
                  </div>

                  {opp.linked_theme_objects && opp.linked_theme_objects.length > 0 && (
                    <div className="pt-2">
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Linked Themes ({opp.linked_theme_objects.length})</h3>
                      <div className="flex flex-col gap-2">
                        {opp.linked_theme_objects.map((theme) => (
                          <Link key={theme.theme_id} href={`/themes?selected=${theme.theme_id}`} className="flex items-center justify-between p-3 border border-slate-100 rounded-md hover:border-slate-300 transition-colors group">
                             <span className="text-[13px] font-medium text-slate-800 group-hover:text-indigo-600">{theme.theme_name}</span>
                             <ChevronRight className="w-4 h-4 text-slate-300" />
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
    </div>
  );
}
