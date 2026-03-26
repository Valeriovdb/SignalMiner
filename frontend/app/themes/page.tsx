"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchThemes } from "@/lib/api";
import { Theme, Platform } from "@/lib/types";
import { ThemeCard } from "@/components/ThemeCard";
import { EvidenceCard } from "@/components/EvidenceCard";
import { SignalBadge } from "@/components/SignalBadge";
import { PlatformBadge } from "@/components/PlatformBadge";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  TRAINING_SURFACE_LABELS,
  ISSUE_TYPE_LABELS,
  PAIN_TYPE_LABELS,
  STRATEGIC_RELEVANCE_LABELS,
  PLATFORM_LABELS,
} from "@/lib/constants";

const PLATFORM_FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "garmin", label: "Garmin" },
  { key: "polar", label: "Polar" },
  { key: "coros", label: "COROS" },
  { key: "strava", label: "Strava" },
  { key: "cross_platform", label: "Cross-Platform" },
];

function ThemesContent() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("selected");

  const [themes, setThemes] = useState<Theme[]>([]);
  const [selected, setSelected] = useState<Theme | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [platformFilter, setPlatformFilter] = useState("all");
  const [competitiveOnly, setCompetitiveOnly] = useState(false);

  useEffect(() => {
    fetchThemes()
      .then((data) => {
        setThemes(data.themes);
        if (selectedId) {
          const found = data.themes.find((t: Theme) => t.theme_id === selectedId);
          if (found) setSelected(found);
        } else if (data.themes.length > 0) {
          setSelected(data.themes[0]);
        }
      })
      .catch((e) => setError(e.message));
  }, [selectedId]);

  const filtered = themes
    .filter((t) => platformFilter === "all" || t.platform === platformFilter)
    .filter((t) => !competitiveOnly || t.competitive_signal);

  if (error) return <p className="text-red-400 text-sm">{error}</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Themes</h1>
        <p className="text-slate-400 text-sm mt-1">{themes.length} recurring pain clusters · training features & coaching</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        {PLATFORM_FILTERS.map((f) => (
          <FilterButton key={f.key} label={f.label} active={platformFilter === f.key} onClick={() => setPlatformFilter(f.key)} />
        ))}
        <div className="h-4 w-px bg-slate-700 mx-1" />
        <button
          onClick={() => setCompetitiveOnly(!competitiveOnly)}
          className={`px-3 py-1 rounded-full text-xs border transition-colors flex items-center gap-1 ${
            competitiveOnly ? "border-amber-500 text-amber-300 bg-amber-500/10" : "border-slate-700 text-slate-400 hover:border-slate-500"
          }`}
        >
          ⚡ Competitive only
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Theme list */}
        <div className="lg:col-span-1 space-y-3">
          {filtered.length === 0 && (
            <p className="text-slate-500 text-sm py-4">No themes match the current filter.</p>
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
        {selected && (
          <div className="lg:col-span-2 space-y-5">
            <div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                <PlatformBadge platform={selected.platform} />
                <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                  {TRAINING_SURFACE_LABELS[selected.surface] ?? selected.surface}
                </Badge>
                <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                  {ISSUE_TYPE_LABELS[selected.issue_type] ?? selected.issue_type}
                </Badge>
                <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                  {PAIN_TYPE_LABELS[selected.pain_type] ?? selected.pain_type}
                </Badge>
                {selected.competitive_signal && (
                  <Badge variant="outline" className="text-xs border-amber-500/40 text-amber-400 bg-amber-500/10">
                    ⚡ Competitive signal
                  </Badge>
                )}
              </div>
              <h2 className="text-xl font-semibold text-white">{selected.theme_name}</h2>
              <p className="text-slate-300 text-sm mt-2 leading-relaxed">{selected.summary}</p>
            </div>

            {/* Competitive context */}
            {selected.competitive_signal && selected.competitor_mentioned && (
              <div className="rounded-lg border border-amber-900/30 bg-amber-950/10 px-4 py-3">
                <p className="text-xs text-amber-400/70 mb-1 font-medium uppercase tracking-wide">Competitor Referenced</p>
                <p className="text-sm text-slate-300">{selected.competitor_mentioned}</p>
              </div>
            )}

            {/* Problem + impact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border border-slate-800 rounded-lg p-3 bg-slate-900/50">
                <p className="text-xs text-slate-500 mb-1.5 font-medium uppercase tracking-wide">Problem</p>
                <p className="text-sm text-slate-300 leading-relaxed">{selected.problem_statement}</p>
              </div>
              <div className="border border-slate-800 rounded-lg p-3 bg-slate-900/50">
                <p className="text-xs text-slate-500 mb-1.5 font-medium uppercase tracking-wide">User Impact</p>
                <p className="text-sm text-slate-300 leading-relaxed">{selected.user_impact}</p>
              </div>
            </div>

            {/* Signal dimensions */}
            <div className="grid grid-cols-3 gap-3">
              <SignalDimension label="Frequency" level={selected.frequency} />
              <SignalDimension label="Severity" level={selected.severity} />
              <SignalDimension label="Confidence" level={selected.confidence} />
            </div>

            {/* Strategic relevance */}
            {selected.strategic_relevance?.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Strategic Relevance</p>
                <div className="flex flex-wrap gap-2">
                  {selected.strategic_relevance.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs border-slate-700 text-slate-300">
                      {STRATEGIC_RELEVANCE_LABELS[tag] ?? tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator className="border-slate-800" />

            {/* Evidence */}
            {selected.evidence?.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wide">Representative Evidence</p>
                <div className="space-y-3">
                  {selected.evidence.map((ev) => (
                    <EvidenceCard key={ev.id} evidence={ev} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SignalDimension({ label, level }: { label: string; level: "low" | "medium" | "high" }) {
  return (
    <div className="border border-slate-800 rounded-lg p-3 bg-slate-900">
      <p className="text-xs text-slate-500 mb-1.5 font-medium">{label}</p>
      <SignalBadge level={level} />
    </div>
  );
}

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs border transition-colors ${
        active ? "border-indigo-500 text-indigo-300 bg-indigo-500/10" : "border-slate-700 text-slate-400 hover:border-slate-500"
      }`}
    >
      {label}
    </button>
  );
}

export default function ThemesPage() {
  return (
    <Suspense fallback={<div className="text-slate-500 text-sm">Loading...</div>}>
      <ThemesContent />
    </Suspense>
  );
}
