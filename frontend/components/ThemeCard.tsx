"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SignalBadge } from "./SignalBadge";
import { PlatformBadge } from "./PlatformBadge";
import { Theme } from "@/lib/types";
import { TRAINING_SURFACE_LABELS, PAIN_TYPE_LABELS } from "@/lib/constants";

interface Props {
  theme: Theme;
  onClick?: () => void;
  selected?: boolean;
}

export function ThemeCard({ theme, onClick, selected }: Props) {
  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 border bg-slate-900 hover:border-slate-500 ${
        selected ? "border-indigo-500 ring-1 ring-indigo-500/30" : "border-slate-800"
      }`}
    >
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
              <PlatformBadge platform={theme.platform} />
              {theme.competitive_signal && (
                <span className="text-xs text-amber-400 font-medium">⚡ competitive</span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-white leading-snug">{theme.theme_name}</h3>
          </div>
          <SignalBadge level={theme.confidence} prefix="conf." />
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <p className="text-xs text-slate-400 leading-relaxed mb-3">{theme.summary}</p>
        <div className="flex flex-wrap gap-1.5 items-center">
          <SignalBadge level={theme.frequency} prefix="freq." />
          <SignalBadge level={theme.severity} prefix="sev." />
          {theme.aggregated_mentions > 0 && (
            <span className="text-xs text-slate-500 ml-1">{theme.aggregated_mentions} mentions</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
