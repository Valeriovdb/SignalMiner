"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchThemes } from "@/lib/api";
import { Theme } from "@/lib/types";
import { PlatformBadge } from "@/components/PlatformBadge";
import { Badge } from "@/components/ui/badge";
import { SOURCE_LABELS, TRAINING_SURFACE_LABELS } from "@/lib/constants";
import { MetadataRow } from "@/components/MetadataRow";
import { EvidenceQuote } from "@/components/EvidenceQuote";

function ThemesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedId = searchParams.get("selected");

  const [themes, setThemes] = useState<Theme[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchThemes()
      .then((data) => setThemes(data.themes))
      .catch((e) => setError(e.message));
  }, []);

  const selected = themes.find((t) => t.theme_id === selectedId) || null;

  if (error) return <p className="text-slate-500 text-sm py-8 text-center font-medium">Unable to load themes.</p>;

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-4 border-b border-slate-100 pb-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Recurring Themes</h1>
          <p className="text-slate-500 text-sm">
            Themes represent recurring user problem patterns clustered from raw feedback items.
          </p>
        </div>
        <MetadataRow 
          itemCount={themes.reduce((acc, t) => acc + (t.evidence?.length || 0), 0)}
          sourceTypes={["Google Play", "Reddit", "Garmin Forums"]}
          timeRange="Last 90 days"
        />
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Theme List */}
        <div className="col-span-5 space-y-2">
          {themes.map((theme) => (
            <button
              key={theme.theme_id}
              onClick={() => router.push(`/themes?selected=${theme.theme_id}`)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedId === theme.theme_id
                  ? "bg-white border-slate-900 shadow-sm"
                  : "bg-white border-slate-100 hover:border-slate-300"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-[14px] font-semibold text-slate-900 leading-snug">{theme.theme_name}</h3>
                <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                  {theme.evidence?.length || 0} items
                </span>
              </div>
              <p className="text-[13px] text-slate-600 line-clamp-2 mb-3">{theme.summary}</p>
              <div className="flex gap-2">
                <PlatformBadge platform={theme.platform} />
                <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider text-slate-400 border-slate-200">
                  {TRAINING_SURFACE_LABELS[theme.surface] || theme.surface}
                </Badge>
              </div>
            </button>
          ))}
        </div>

        {/* Theme Detail */}
        <div className="col-span-7 sticky top-24">
          {selected ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-2">{selected.theme_name}</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed">{selected.summary}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Problem Statement</h4>
                    <p className="text-[13px] text-slate-800">{selected.problem_statement}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">User Impact</h4>
                    <p className="text-[13px] text-slate-800">{selected.user_impact}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Representative Evidence</h3>
                <div className="space-y-6">
                  {selected.evidence?.slice(0, 3).map((ev) => (
                    <EvidenceQuote key={ev.id} evidence={ev} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl">
              <p className="text-slate-400 font-medium italic">Select a theme to inspect patterns</p>
            </div>
          )}
        </div>
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
