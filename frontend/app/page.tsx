"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchOverview, fetchThemes } from "@/lib/api";
import { OverviewData, Theme } from "@/lib/types";
import { getPriorityLabel, PRIORITY_CONFIG, PriorityLabel } from "@/lib/priority";
import { TRAINING_SURFACE_LABELS } from "@/lib/constants";

const SURFACE_OPTIONS = [
  { key: "all", label: "All areas" },
  { key: "training_plans", label: "Training Plans" },
  { key: "coaching_recommendations", label: "Coaching" },
  { key: "training_load", label: "Training Load" },
  { key: "performance_analytics", label: "Analytics" },
  { key: "workout_suggestions", label: "Workout Suggestions" },
  { key: "post_activity_insights", label: "Post-Activity" },
  { key: "third_party_integrations", label: "Integrations" },
];

const PRIORITY_ORDER: Record<PriorityLabel, number> = {
  investigate_now: 0,
  monitor: 1,
  needs_validation: 2,
};
const LEVEL_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

export default function OverviewPage() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [surfaceFilter, setSurfaceFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    fetchOverview().then(setOverview).catch((e) => setError(e.message));
    fetchThemes()
      .then((d) => setThemes(d.themes))
      .catch(() => {});
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!overview) return <LoadingState />;

  const garminThemes = themes.filter(
    (t) => t.platform === "garmin" || t.platform === "cross_platform"
  );

  const filtered = garminThemes
    .filter((t) => surfaceFilter === "all" || t.surface === surfaceFilter)
    .filter((t) => priorityFilter === "all" || getPriorityLabel(t) === priorityFilter);

  const sorted = [...filtered].sort((a, b) => {
    const pa = PRIORITY_ORDER[getPriorityLabel(a)];
    const pb = PRIORITY_ORDER[getPriorityLabel(b)];
    if (pa !== pb) return pa - pb;
    return (LEVEL_ORDER[a.severity] ?? 1) - (LEVEL_ORDER[b.severity] ?? 1);
  });

  const counts = {
    investigate_now: garminThemes.filter((t) => getPriorityLabel(t) === "investigate_now").length,
    monitor: garminThemes.filter((t) => getPriorityLabel(t) === "monitor").length,
    needs_validation: garminThemes.filter((t) => getPriorityLabel(t) === "needs_validation").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Theme Triage</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Garmin · {garminThemes.length} recurring signal clusters · {overview.meta.total_items.toLocaleString()} feedback items
          </p>
        </div>
        <p className="text-slate-600 text-xs shrink-0 mt-1">
          {new Date(overview.meta.generated_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Priority summary — clickable buckets */}
      <div className="grid grid-cols-3 gap-3">
        {(["investigate_now", "monitor", "needs_validation"] as PriorityLabel[]).map((p) => {
          const cfg = PRIORITY_CONFIG[p];
          const active = priorityFilter === p;
          return (
            <button
              key={p}
              onClick={() => setPriorityFilter(active ? "all" : p)}
              className={`rounded-lg border p-3 text-left transition-all ${
                active
                  ? `${cfg.className} ring-1 ring-current/20`
                  : "border-slate-800 bg-slate-900 hover:border-slate-700"
              }`}
            >
              <p className={`text-2xl font-semibold ${active ? "" : "text-white"}`}>
                {counts[p]}
              </p>
              <p className={`text-xs mt-1 ${active ? "" : "text-slate-400"}`}>{cfg.label}</p>
            </button>
          );
        })}
      </div>

      {/* Surface filter */}
      <div className="flex flex-wrap gap-1.5">
        {SURFACE_OPTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setSurfaceFilter(s.key)}
            className={`px-3 py-1 rounded-full text-xs border transition-colors ${
              surfaceFilter === s.key
                ? "border-indigo-500 text-indigo-300 bg-indigo-500/10"
                : "border-slate-700 text-slate-400 hover:border-slate-600"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Theme table */}
      <div className="rounded-lg border border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60">
              <th className="text-left px-4 py-2.5 text-xs text-slate-500 font-medium">Priority</th>
              <th className="text-left px-4 py-2.5 text-xs text-slate-500 font-medium">Theme</th>
              <th className="text-left px-4 py-2.5 text-xs text-slate-500 font-medium hidden md:table-cell">
                Surface
              </th>
              <th className="text-left px-4 py-2.5 text-xs text-slate-500 font-medium hidden lg:table-cell">
                Signal
              </th>
              <th className="text-right px-4 py-2.5 text-xs text-slate-500 font-medium">
                Evidence
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {sorted.map((theme) => (
              <ThemeRow key={theme.theme_id} theme={theme} />
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500 text-sm">
                  No themes match the current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-600">
        Priority is derived from severity × confidence. These are discovery inputs — not confirmed issues or roadmap commitments.
      </p>
    </div>
  );
}

function ThemeRow({ theme }: { theme: Theme }) {
  const router = useRouter();
  const priority = getPriorityLabel(theme);
  const cfg = PRIORITY_CONFIG[priority];

  return (
    <tr
      onClick={() => router.push(`/themes?selected=${theme.theme_id}`)}
      className="hover:bg-slate-800/30 transition-colors cursor-pointer"
    >
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs border ${cfg.className}`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
          {cfg.label}
        </span>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-white font-medium leading-snug">{theme.theme_name}</p>
        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{theme.summary}</p>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <span className="text-xs text-slate-400">
          {TRAINING_SURFACE_LABELS[theme.surface] ?? theme.surface}
        </span>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <div className="flex gap-3">
          <SignalDot label="Freq" level={theme.frequency} />
          <SignalDot label="Sev" level={theme.severity} />
          <SignalDot label="Conf" level={theme.confidence} />
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-xs text-slate-400">{theme.evidence?.length ?? 0}</span>
      </td>
    </tr>
  );
}

function SignalDot({ label, level }: { label: string; level: string }) {
  const colors: Record<string, string> = {
    high: "text-emerald-400",
    medium: "text-amber-400",
    low: "text-slate-500",
  };
  return (
    <span className="text-xs">
      <span className="text-slate-600">{label} </span>
      <span className={colors[level] ?? "text-slate-500"}>{level}</span>
    </span>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-slate-500 text-sm">Loading...</p>
    </div>
  );
}

function ErrorState({ message: _ }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <p className="text-slate-400 text-sm">Unable to load data.</p>
        <p className="text-slate-600 text-xs mt-1">Please try refreshing the page.</p>
      </div>
    </div>
  );
}
