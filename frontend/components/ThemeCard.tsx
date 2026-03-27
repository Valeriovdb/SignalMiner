"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Theme } from "@/lib/types";
import { getPriorityLabel, PRIORITY_CONFIG } from "@/lib/priority";
import { TRAINING_SURFACE_LABELS } from "@/lib/constants";

interface Props {
  theme: Theme;
  onClick?: () => void;
  selected?: boolean;
}

export function ThemeCard({ theme, onClick, selected }: Props) {
  const priority = getPriorityLabel(theme);
  const cfg = PRIORITY_CONFIG[priority];

  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer transition-all duration-150 border bg-slate-900 hover:border-slate-600 ${
        selected ? "border-indigo-500 ring-1 ring-indigo-500/30" : "border-slate-800"
      }`}
    >
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex items-start justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs border ${cfg.className}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
            {cfg.label}
          </span>
          <span className="text-xs text-slate-500 shrink-0">
            {theme.evidence?.length ?? 0} items
          </span>
        </div>
        <h3 className="text-sm font-semibold text-white leading-snug mt-1.5">{theme.theme_name}</h3>
      </CardHeader>
      <CardContent className="px-4 pb-3">
        <p className="text-xs text-slate-400 leading-relaxed mb-2.5 line-clamp-2">{theme.summary}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {TRAINING_SURFACE_LABELS[theme.surface] ?? theme.surface}
          </span>
          <div className="flex gap-2">
            <SignalDot label="S" level={theme.severity} />
            <SignalDot label="C" level={theme.confidence} />
          </div>
        </div>
      </CardContent>
    </Card>
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
