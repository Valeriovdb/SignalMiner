"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchThemes } from "@/lib/api";
import { Theme } from "@/lib/types";
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

function ThemesContent() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("selected");

  const [themes, setThemes] = useState<Theme[]>([]);
  const [selected, setSelected] = useState<Theme | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [platformFilter, setPlatformFilter] = useState("garmin");
  const [competitiveOnly, setCompetitiveOnly] = useState(false);

  useEffect(() => {
    fetchThemes()
      .then((data) => {
        setThemes(data.themes);
        if (selectedId) {
          const found = data.themes.find((t: Theme) => t.theme_id === selectedId);
          if (found) {
            setSelected(found);
            // expand platform filter if the selected theme is from a different platform
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

  const filtered = themes
    .filter((t) => platformFilter === "all" || t.platform === platformFilter)
    .filter((t) => !competitiveOnly || t.competitive_signal);

  if (error) return <p className="text-red-400 text-sm">{error}</p>;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-white">Themes</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          {themes.length} recurring pain clusters · training features & coaching
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        {PLATFORM_FILTERS.map((f) => (
          <FilterButton
            key={f.key}
            label={f.label}
            active={platformFilter === f.key}
            onClick={() => setPlatformFilter(f.key)}
          />
        ))}
        <div className="h-4 w-px bg-slate-700 mx-1" />
        <button
          onClick={() => setCompetitiveOnly(!competitiveOnly)}
          className={`px-3 py-1 rounded-full text-xs border transition-colors flex items-center gap-1 ${
            competitiveOnly
              ? "border-amber-500 text-amber-300 bg-amber-500/10"
              : "border-slate-700 text-slate-400 hover:border-slate-500"
          }`}
        >
          ⚡ Competitive only
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Theme list */}
        <div className="lg:col-span-1 space-y-2">
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
        {selected && <ThemeDetail theme={selected} />}
      </div>
    </div>
  );
}

function ThemeDetail({ theme }: { theme: Theme }) {
  const priority = getPriorityLabel(theme);
  const cfg = PRIORITY_CONFIG[priority];
  const discoverySteps = DISCOVERY_STEPS[theme.issue_type] ?? DISCOVERY_STEPS["other"];

  // Source distribution from evidence
  const sourceCounts: Record<string, number> = {};
  for (const ev of theme.evidence ?? []) {
    sourceCounts[ev.source] = (sourceCounts[ev.source] ?? 0) + 1;
  }

  return (
    <div className="lg:col-span-2 space-y-5">
      {/* Theme header */}
      <div>
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs border ${cfg.className}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
            {cfg.label}
          </span>
          <PlatformBadge platform={theme.platform} />
          <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
            {TRAINING_SURFACE_LABELS[theme.surface] ?? theme.surface}
          </Badge>
          <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
            {ISSUE_TYPE_LABELS[theme.issue_type] ?? theme.issue_type}
          </Badge>
          {theme.competitive_signal && (
            <Badge variant="outline" className="text-xs border-amber-500/40 text-amber-400 bg-amber-500/10">
              ⚡ Competitive signal
            </Badge>
          )}
        </div>
        <h2 className="text-lg font-semibold text-white">{theme.theme_name}</h2>
        <p className="text-slate-300 text-sm mt-1.5 leading-relaxed">{theme.summary}</p>
      </div>

      {/* Competitor context */}
      {theme.competitive_signal && theme.competitor_mentioned && (
        <div className="rounded-lg border border-amber-900/30 bg-amber-950/10 px-4 py-3">
          <p className="text-xs text-amber-400/70 mb-1 font-medium uppercase tracking-wide">
            Competitor Referenced
          </p>
          <p className="text-sm text-slate-300">{theme.competitor_mentioned}</p>
        </div>
      )}

      {/* Problem + impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="border border-slate-800 rounded-lg p-3 bg-slate-900/50">
          <p className="text-xs text-slate-500 mb-1.5 font-medium uppercase tracking-wide">Problem</p>
          <p className="text-sm text-slate-300 leading-relaxed">{theme.problem_statement}</p>
        </div>
        <div className="border border-slate-800 rounded-lg p-3 bg-slate-900/50">
          <p className="text-xs text-slate-500 mb-1.5 font-medium uppercase tracking-wide">User Impact</p>
          <p className="text-sm text-slate-300 leading-relaxed">{theme.user_impact}</p>
        </div>
      </div>

      {/* Signal dimensions */}
      <div className="grid grid-cols-3 gap-3">
        <SignalDimension label="Frequency" level={theme.frequency} />
        <SignalDimension label="Severity" level={theme.severity} />
        <SignalDimension label="Confidence" level={theme.confidence} />
      </div>

      {/* Strategic relevance + source distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {theme.strategic_relevance?.length > 0 && (
          <div className="border border-slate-800 rounded-lg p-3 bg-slate-900/50">
            <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">
              Strategic Relevance
            </p>
            <div className="flex flex-wrap gap-1.5">
              {theme.strategic_relevance.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs border-slate-700 text-slate-300">
                  {STRATEGIC_RELEVANCE_LABELS[tag] ?? tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {Object.keys(sourceCounts).length > 0 && (
          <div className="border border-slate-800 rounded-lg p-3 bg-slate-900/50">
            <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">
              Source Distribution
            </p>
            <div className="space-y-1.5">
              {Object.entries(sourceCounts).map(([src, count]) => (
                <div key={src} className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {SOURCE_LABELS[src] ?? src}
                  </span>
                  <span className="text-xs text-slate-500">{count} items</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Discovery next steps */}
      <div className="rounded-lg border border-indigo-900/30 bg-indigo-950/15 px-4 py-3">
        <p className="text-xs text-indigo-400/70 mb-2 font-medium uppercase tracking-wide">
          Suggested Discovery Next Steps
        </p>
        <ol className="space-y-1.5">
          {discoverySteps.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="text-indigo-500 font-mono text-xs mt-0.5 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <Separator className="border-slate-800" />

      {/* Evidence */}
      {theme.evidence?.length > 0 && (
        <div>
          <p className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wide">
            Representative Evidence ({theme.evidence.length})
          </p>
          <div className="space-y-2.5">
            {theme.evidence.map((ev) => (
              <EvidenceCard key={ev.id} evidence={ev} />
            ))}
          </div>
        </div>
      )}
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

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs border transition-colors ${
        active
          ? "border-indigo-500 text-indigo-300 bg-indigo-500/10"
          : "border-slate-700 text-slate-400 hover:border-slate-500"
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
