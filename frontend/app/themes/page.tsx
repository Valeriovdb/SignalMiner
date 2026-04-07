"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchThemes } from "@/lib/api";
import { Theme } from "@/lib/types";
import { ThemeCard } from "@/components/ThemeCard";
import { PlatformBadge } from "@/components/PlatformBadge";
import { Badge } from "@/components/ui/badge";
import {
  TRAINING_SURFACE_LABELS,
  SOURCE_LABELS,
} from "@/lib/constants";
import { DISCOVERY_STEPS, getPriorityLabel, PRIORITY_CONFIG } from "@/lib/priority";

const PLATFORM_FILTERS: { key: string; label: string }[] = [
  { key: "garmin", label: "Garmin" },
  { key: "cross_platform", label: "Cross-Platform" },
  { key: "polar", label: "Polar" },
  { key: "coros", label: "COROS" },
  { key: "strava", label: "Strava" },
  { key: "all", label: "All" },
];

import { MetadataRow } from "@/components/MetadataRow";
import { EvidenceQuote } from "@/components/EvidenceQuote";

function ThemesContent() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("selected");

  const [themes, setThemes] = useState<Theme[]>([]);
  const [selected, setSelected] = useState<Theme | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [platformFilter, setPlatformFilter] = useState("garmin");

  useEffect(() => {
    fetchThemes()
      .then((data) => {
        setThemes(data.themes);
        if (selectedId) {
          const found = data.themes.find((t: Theme) => t.theme_id === selectedId);
          if (found) {
            setSelected(found);
            if (found.platform !== "garmin" && found.platform !== "cross_platform") {
              setPlatformFilter("all");
            }
          }
        } else if (data.themes.length > 0) {
          const garminFirst = data.themes.find(
            (t: Theme) => t.platform === "garmin" || t.platform === "cross_platform"
          );
          setSelected(garminFirst ?? data.themes[0]);
        }
      })
      .catch((e) => setError(e.message));
  }, [selectedId]);

  const filtered = themes.filter((t) => platformFilter === "all" || t.platform === platformFilter);

  if (error) return <p className="text-slate-500 text-sm py-8 text-center font-medium">Unable to load themes. Please refresh.</p>;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Recurring Themes</h1>
          <p className="text-slate-500 text-sm font-normal">
            Clustered user pain points across training intelligence and coaching surfaces.
          </p>
        </div>
        
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
          {PLATFORM_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setPlatformFilter(f.key)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all ${
                platformFilter === f.key
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Theme list */}
        <div className="lg:col-span-4 space-y-3">
          {filtered.length === 0 && (
            <p className="text-slate-400 text-sm py-4 italic font-medium">No themes match the current filter.</p>
          )}
          {filtered.map((theme) => (
            <ThemeCard
              key={theme.theme_id}
              theme={theme}
              selected={selected?.theme_id === theme.theme_id}
              onClick={() => setSelected(theme)}
            />
          ))}
        </div>

        {/* Theme detail */}
        <div className="lg:col-span-8">
          {selected ? (
            <ThemeDetail theme={selected} />
          ) : (
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl">
               <p className="text-slate-400 text-sm font-medium">Select a theme to view analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ThemeDetail({ theme }: { theme: Theme }) {
  const priority = getPriorityLabel(theme);
  const cfg = PRIORITY_CONFIG[priority];

  // Source distribution
  const sourceCounts: Record<string, number> = {};
  for (const ev of theme.evidence ?? []) {
    sourceCounts[ev.source] = (sourceCounts[ev.source] ?? 0) + 1;
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Detail Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${cfg.className}`}>
             {cfg.label}
          </span>
          <PlatformBadge platform={theme.platform} />
          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider border-slate-200 text-slate-500 bg-slate-50">
            {TRAINING_SURFACE_LABELS[theme.surface] ?? theme.surface}
          </Badge>
        </div>
        
        <h2 className="text-3xl font-semibold text-slate-900 leading-tight tracking-tight">
          {theme.theme_name}
        </h2>
        
        <p className="text-[16px] text-slate-600 leading-relaxed font-normal">
          {theme.summary}
        </p>

        <MetadataRow 
          itemCount={theme.evidence?.length ?? 0}
          sourceTypes={Object.keys(sourceCounts).map(s => SOURCE_LABELS[s] ?? s)}
          className="pt-2"
        />
      </div>

      {/* Core Problem & Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-slate-100">
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">The Problem</h3>
          <p className="text-[14px] text-slate-800 leading-relaxed font-medium">
            {theme.problem_statement}
          </p>
        </div>
        <div className="space-y-2 border-l border-slate-100 pl-8">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">User Impact</h3>
          <p className="text-[14px] text-slate-800 leading-relaxed font-medium">
            {theme.user_impact}
          </p>
        </div>
      </div>

      {/* Supporting Evidence */}
      <div className="space-y-6">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
           Representative Evidence
        </h3>
        <div className="space-y-8">
          {theme.evidence?.slice(0, 5).map((ev) => (
            <EvidenceQuote key={ev.id} evidence={ev} />
          ))}
        </div>
      </div>

      {/* Discovery Next Steps */}
      <div className="bg-slate-900 rounded-xl p-8 text-white space-y-6">
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Discovery Next Steps</h3>
          <p className="text-lg font-medium text-slate-100">How to validate this theme further:</p>
        </div>
        <ul className="space-y-4">
          {(DISCOVERY_STEPS[theme.issue_type] ?? DISCOVERY_STEPS["other"]).map((step, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="text-slate-500 font-mono text-sm pt-0.5">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-slate-300 text-[15px] leading-relaxed">{step}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ThemesPage() {
  return (
    <Suspense fallback={<div className="text-slate-500 text-sm">Loading...</div>}>
      <ThemesContent />
    </Suspense>
  );
}
