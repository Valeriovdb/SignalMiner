"use client";

import { useEffect, useState } from "react";
import { fetchOverview } from "@/lib/api";
import { OverviewData, Theme } from "@/lib/types";
import { ThemeCard } from "@/components/ThemeCard";
import { PlatformBadge } from "@/components/PlatformBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function OverviewPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOverview().then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingState />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-1">SignalMiner</p>
        <h1 className="text-2xl font-semibold text-white">Training Intelligence Gap</h1>
        <p className="text-slate-400 text-sm mt-1">
          Category-level signal analysis across {data.platforms?.length ?? 0} platforms · {data.meta.total_items.toLocaleString()} feedback items
        </p>
        {data.meta.generated_at && (
          <p className="text-slate-600 text-xs mt-1">
            Last analyzed {new Date(data.meta.generated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Feedback Items" value={data.meta.total_items} />
        <StatCard label="Recurring Themes" value={data.theme_count} />
        <StatCard label="Opportunity Areas" value={data.opportunity_count} />
        <StatCard label="Competitive Signals" value={data.competitive_theme_count} highlight />
      </div>

      {/* Platform + source mix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Platforms</h2>
          <div className="flex flex-wrap gap-2">
            {data.platforms?.map((p) => (
              <div key={p.key} className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2">
                <PlatformBadge platform={p.key as any} />
                <span className="text-white font-semibold text-sm">{p.count}</span>
                <span className="text-slate-500 text-xs">items</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Sources</h2>
          <div className="flex flex-wrap gap-2">
            {data.sources.map((s) => (
              <div key={s.key} className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2">
                <span className="text-white font-semibold text-sm">{s.count}</span>
                <span className="text-slate-400 text-xs">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Competitive landscape */}
      {data.competitive_landscape_summary && (
        <div className="rounded-lg border border-amber-900/30 bg-amber-950/10 px-5 py-4">
          <p className="text-xs text-amber-400/70 uppercase tracking-wide font-medium mb-2">Competitive Landscape</p>
          <p className="text-sm text-slate-300 leading-relaxed">{data.competitive_landscape_summary}</p>
        </div>
      )}

      {/* Executive summary */}
      {data.executive_summary && (
        <div className="rounded-lg border border-slate-700 bg-slate-900/50 px-5 py-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">Executive Summary</p>
          <p className="text-sm text-slate-300 leading-relaxed">{data.executive_summary}</p>
        </div>
      )}

      {/* Top insights */}
      {data.top_insights?.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-slate-300 mb-3">Top Insights</h2>
          <ul className="space-y-2">
            {data.top_insights.map((insight, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                <span className="text-indigo-500 mt-0.5 font-mono text-xs shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Separator className="border-slate-800" />

      {/* High-confidence themes */}
      {data.high_confidence_themes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-slate-300">High-Confidence Signals</h2>
            <Link href="/themes" className="text-xs text-indigo-400 hover:text-indigo-300">View all themes →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.high_confidence_themes.map((theme: Theme) => (
              <Link key={theme.theme_id} href={`/themes?selected=${theme.theme_id}`}>
                <ThemeCard theme={theme} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/30 px-4 py-3">
        <p className="text-xs text-slate-500 leading-relaxed">
          <span className="text-slate-400 font-medium">Discovery inputs, not decisions.</span>{" "}
          SignalMiner surfaces repeated signals from public feedback to support discovery prioritization.
          Themes represent patterns worth investigating — not confirmed product issues or root causes.
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <Card className={`border ${highlight ? "border-amber-900/40 bg-amber-950/10" : "border-slate-800 bg-slate-900"}`}>
      <CardContent className="p-4">
        <p className={`text-2xl font-semibold ${highlight ? "text-amber-400" : "text-white"}`}>{value}</p>
        <p className="text-xs text-slate-400 mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-slate-500 text-sm">Loading analysis...</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-6 max-w-lg">
      <h2 className="text-red-400 font-medium mb-2">Data not available</h2>
      <p className="text-slate-400 text-sm">{message}</p>
      <p className="text-slate-500 text-xs mt-3">
        Run: <code className="text-slate-300">bash scripts/run_pipeline.sh</code>
      </p>
    </div>
  );
}
