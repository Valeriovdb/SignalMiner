import React from "react";
import { Info } from "lucide-react";

interface ScoreExplanationProps {
  label: string;
  explanation: string;
  className?: string;
}

export function ScoreExplanation({
  label,
  explanation,
  className = "",
}: ScoreExplanationProps) {
  return (
    <div className={`flex items-start gap-2 p-3 bg-slate-50 border border-slate-200 rounded-md ${className}`}>
      <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
      <div className="space-y-1">
        <p className="text-[11px] font-semibold text-slate-900 uppercase tracking-wider leading-none">
          How this is {label}
        </p>
        <p className="text-[12px] text-slate-600 leading-relaxed">
          {explanation}
        </p>
      </div>
    </div>
  );
}
