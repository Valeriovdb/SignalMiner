"use client";

import { useEffect, useState } from "react";
import { fetchEvidence } from "@/lib/api";
import { Evidence } from "@/lib/types";
import { EvidenceQuote } from "@/components/EvidenceQuote";

const SOURCE_FILTERS = [
  { key: "all", label: "All Sources" },
  { key: "google_play", label: "Google Play" },
  { key: "reddit", label: "Reddit" },
  { key: "garmin_forums", label: "Garmin Forums" },
];

const PLATFORM_FILTERS = [
  { key: "all", label: "All Platforms" },
  { key: "garmin", label: "Garmin" },
  { key: "polar", label: "Polar" },
  { key: "coros", label: "COROS" },
  { key: "strava", label: "Strava" },
  { key: "cross_platform", label: "Cross-Platform" },
];

export default function EvidencePage() {
  const [allEvidence, setAllEvidence] = useState<Evidence[]>([]);
  const [source, setSource] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvidence()
      .then((data) => setAllEvidence(data.evidence as Evidence[]))
      .catch(() => setAllEvidence([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = allEvidence
    .filter((e) => source === "all" || e.source === source)
    .filter((e) => platform === "all" || e.platform === platform)
    .filter((e) =>
      search.trim() ? e.text.toLowerCase().includes(search.toLowerCase()) : true
    );

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="space-y-1 border-b border-slate-100 pb-8">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Raw Evidence</h1>
        <p className="text-slate-500 text-sm">
          The foundation of all themes and opportunities. Inspect individual quotes and feedback items.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-48 shrink-0 space-y-8 sticky top-24">
          <div className="space-y-3">
             <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Source</h3>
             <div className="flex flex-col gap-1">
                {SOURCE_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setSource(f.key)}
                    className={`text-left px-2 py-1.5 rounded-md text-[13px] transition-colors ${
                      source === f.key ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
             </div>
          </div>

          <div className="space-y-3">
             <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform</h3>
             <div className="flex flex-col gap-1">
                {PLATFORM_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setPlatform(f.key)}
                    className={`text-left px-2 py-1.5 rounded-md text-[13px] transition-colors ${
                      platform === f.key ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
             </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search evidence text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-4 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 transition-all shadow-sm"
            />
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-3">
               <div className="animate-spin w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full mx-auto" />
               <p className="text-slate-400 text-sm font-medium italic">Loading evidence items...</p>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{filtered.length} items found</p>
              </div>
              
              <div className="space-y-10">
                {filtered.map((ev) => (
                  <EvidenceQuote key={ev.id} evidence={ev} />
                ))}
                {filtered.length === 0 && (
                  <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-xl">
                    <p className="text-slate-400 text-sm font-medium italic">No evidence items match your filters.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
