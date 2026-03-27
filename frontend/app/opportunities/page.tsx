"use client";

import { useEffect, useState } from "react";
import { fetchOpportunities } from "@/lib/api";
import { Opportunity } from "@/lib/types";
import { SignalBadge } from "@/components/SignalBadge";
import { ThemeCard } from "@/components/ThemeCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { STRATEGIC_RELEVANCE_LABELS } from "@/lib/constants";
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

  if (error) return <p className="text-red-400 text-sm">{error}</p>;

  const sorted = [...opportunities].sort(
    (a, b) => (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Opportunity Areas</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          {opportunities.length} discovery-ready areas · derived from cross-platform signal · not roadmap commitments
        </p>
      </div>

      <div className="space-y-4">
        {sorted.map((opp, i) => (
          <OpportunityBlock key={opp.opportunity_id} opp={opp} index={i + 1} />
        ))}
      </div>
    </div>
  );
}

function OpportunityBlock({ opp, index }: { opp: Opportunity; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border border-slate-800 bg-slate-900">
      <CardHeader className="px-5 pt-4 pb-3">
        <div className="flex items-start gap-3">
          <span className="text-slate-600 font-mono text-xs mt-1 shrink-0">
            {String(index).padStart(2, "0")}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <SignalBadge level={opp.priority} prefix="priority" />
              <SignalBadge level={opp.confidence} prefix="conf." />
            </div>
            <h2 className="text-base font-semibold text-white">{opp.opportunity_name}</h2>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5 space-y-3">
        {/* User problem + why now */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="border border-slate-800 rounded-lg p-3 bg-slate-900/50">
            <p className="text-xs text-slate-500 mb-1.5 font-medium uppercase tracking-wide">
              User Problem
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">{opp.user_problem}</p>
          </div>
          <div className="border border-slate-800 rounded-lg p-3 bg-slate-900/50">
            <p className="text-xs text-slate-500 mb-1.5 font-medium uppercase tracking-wide">
              Why Now
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">{opp.why_now}</p>
          </div>
        </div>

        {/* Competitive context */}
        {opp.competitive_context && (
          <div className="rounded-lg border border-amber-900/30 bg-amber-950/10 px-4 py-3">
            <p className="text-xs text-amber-400/70 mb-1.5 font-medium uppercase tracking-wide">
              Competitive Context
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">{opp.competitive_context}</p>
          </div>
        )}

        {/* Suggested direction */}
        <div className="rounded-lg border border-indigo-900/40 bg-indigo-950/20 px-4 py-3">
          <p className="text-xs text-indigo-400/70 mb-1.5 font-medium uppercase tracking-wide">
            Suggested Discovery Direction
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">{opp.suggested_product_direction}</p>
        </div>

        {/* Business impact tags */}
        {opp.expected_business_impact?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {opp.expected_business_impact.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs border-slate-700 text-slate-400">
                {STRATEGIC_RELEVANCE_LABELS[tag] ?? tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Supporting themes */}
        {opp.linked_theme_objects && opp.linked_theme_objects.length > 0 && (
          <>
            <Separator className="border-slate-800" />
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              {expanded ? "Hide" : "Show"} supporting themes ({opp.linked_theme_objects.length})
            </button>
            {expanded && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-1">
                {opp.linked_theme_objects.map((theme) => (
                  <Link key={theme.theme_id} href={`/themes?selected=${theme.theme_id}`}>
                    <ThemeCard theme={theme} />
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
