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
      className={`cursor-pointer transition-all duration-150 border bg-white hover:border-slate-300 ${
        selected ? "border-slate-900 ring-1 ring-slate-900/10 shadow-sm" : "border-slate-200"
      }`}
    >
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex items-start justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${cfg.className}`}>
            <span className={`w-1 h-1 rounded-full shrink-0 ${cfg.dot}`} />
            {cfg.label}
          </span>
          <span className="text-[11px] text-slate-500 font-medium shrink-0">
            {theme.evidence?.length ?? 0} items
          </span>
        </div>
        <h3 className="text-sm font-semibold text-slate-900 leading-snug mt-2 underline-offset-4 decoration-slate-200 decoration-1 group-hover:underline">
          {theme.theme_name}
        </h3>
      </CardHeader>
      <CardContent className="px-4 pb-3">
        <p className="text-[12px] text-slate-600 leading-relaxed mb-3 line-clamp-2">{theme.summary}</p>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            {TRAINING_SURFACE_LABELS[theme.surface] ?? theme.surface}
          </span>
          <div className="flex gap-3">
            <SignalDot label="Severity" level={theme.severity} />
            <SignalDot label="Confidence" level={theme.confidence} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SignalDot({ label, level }: { label: string; level: string }) {
  const colors: Record<string, string> = {
    high: "text-red-600 font-semibold",
    medium: "text-amber-600 font-semibold",
    low: "text-slate-500",
  };
  return (
    <span className="text-[11px]">
      <span className="text-slate-400">{label} </span>
      <span className={colors[level] ?? "text-slate-500"}>{level}</span>
    </span>
  );
}
