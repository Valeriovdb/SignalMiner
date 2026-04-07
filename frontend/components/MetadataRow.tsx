import React from "react";

interface MetadataRowProps {
  itemCount: number;
  sourceTypes: string[];
  timeRange?: string;
  lastUpdated?: string;
  className?: string;
}

export function MetadataRow({
  itemCount,
  sourceTypes,
  timeRange,
  lastUpdated,
  className = "",
}: MetadataRowProps) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-normal ${className}`}>
      <span className="flex items-center gap-1.5">
        <span className="font-medium text-slate-900">{itemCount.toLocaleString()}</span> items analyzed
      </span>
      
      {sourceTypes.length > 0 && (
        <span className="flex items-center gap-1.5 before:content-['•'] before:text-slate-300">
          Sources: <span className="font-medium text-slate-700">{sourceTypes.join(", ")}</span>
        </span>
      )}
      
      {timeRange && (
        <span className="flex items-center gap-1.5 before:content-['•'] before:text-slate-300">
          Range: <span className="font-medium text-slate-700">{timeRange}</span>
        </span>
      )}
      
      {lastUpdated && (
        <span className="flex items-center gap-1.5 before:content-['•'] before:text-slate-300 ml-auto">
          Updated: <span className="font-medium text-slate-700">{lastUpdated}</span>
        </span>
      )}
    </div>
  );
}
