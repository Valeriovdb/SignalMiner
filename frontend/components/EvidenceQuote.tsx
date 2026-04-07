import React from "react";
import { Evidence } from "@/lib/types";
import { SOURCE_LABELS } from "@/lib/constants";

interface Props {
  evidence: Evidence;
  linkedThemes?: string[];
  className?: string;
}

export function EvidenceQuote({ evidence, linkedThemes, className = "" }: Props) {
  return (
    <div className={`border-l-2 border-slate-200 pl-4 py-1.5 space-y-2.5 transition-colors hover:border-slate-400 ${className}`}>
      <blockquote className="text-[14px] text-slate-800 leading-relaxed font-normal italic">
        "{evidence.text}"
      </blockquote>
      
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 font-normal">
        <span className="font-semibold text-slate-900 uppercase tracking-wider">
          {SOURCE_LABELS[evidence.source] ?? evidence.source}
        </span>
        
        {evidence.date && (
          <span className="before:content-['•'] before:text-slate-300 before:mr-2">
            {evidence.date}
          </span>
        )}

        {linkedThemes && linkedThemes.length > 0 && (
          <span className="before:content-['•'] before:text-slate-300 before:mr-2">
            Linked to: <span className="text-slate-700 italic">{linkedThemes.join(", ")}</span>
          </span>
        )}
        
        {evidence.url && (
          <a
            href={evidence.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium ml-auto"
          >
            Source ↗
          </a>
        )}
      </div>
    </div>
  );
}
