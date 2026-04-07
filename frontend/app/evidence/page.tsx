"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchEvidence, fetchThemes, fetchOpportunities } from "@/lib/api";
import { Evidence, Theme, Opportunity } from "@/lib/types";
import { EvidenceQuote } from "@/components/EvidenceQuote";
import { MetadataRow } from "@/components/MetadataRow";
import { Search, Filter, X } from "lucide-react";

function EvidenceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [allEvidence, setAllEvidence] = useState<Evidence[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Filters from URL
  const activeSource = searchParams.get("source") || "all";
  const activeTheme = searchParams.get("theme") || "all";
  const activeOpportunity = searchParams.get("opportunity") || "all";

  useEffect(() => {
    Promise.all([fetchEvidence(), fetchThemes(), fetchOpportunities()])
      .then(([evData, themeData, oppData]) => {
        setAllEvidence(evData.evidence as Evidence[]);
        setThemes(themeData.themes);
        setOpportunities(oppData.opportunities);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/evidence?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    router.push("/evidence");
  };

  const filtered = allEvidence
    .filter((e) => activeSource === "all" || e.source === activeSource)
    .filter((e) => {
      if (activeTheme === "all") return true;
      return e.theme_id === activeTheme;
    })
    .filter((e) => search.trim() ? e.text.toLowerCase().includes(search.toLowerCase()) : true);

  const hasActiveFilters = activeSource !== "all" || activeTheme !== "all" || activeOpportunity !== "all" || search !== "";

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-4 border-b border-slate-100 pb-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Raw Evidence</h1>
          <p className="text-slate-500 text-sm">
            This repository contains the underlying user feedback used to generate all themes and opportunity areas.
          </p>
        </div>
        <MetadataRow 
          itemCount={allEvidence.length}
          sourceTypes={["Google Play", "Reddit", "Garmin Forums"]}
          timeRange="Last 90 days"
        />
      </div>

      <div className="grid grid-cols-12 gap-10 items-start">
        {/* Filters Sidebar */}
        <aside className="col-span-3 space-y-8 sticky top-24">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filters</h3>
              {hasActiveFilters && (
                <button 
                  onClick={clearFilters}
                  className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search text..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 transition-all"
              />
            </div>

            {/* Source Filter */}
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-slate-500">Source</label>
              <select 
                value={activeSource}
                onChange={(e) => updateFilter("source", e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 shadow-sm"
              >
                <option value="all">All Sources</option>
                <option value="google_play">Google Play</option>
                <option value="reddit">Reddit</option>
                <option value="garmin_forums">Garmin Forums</option>
              </select>
            </div>

            {/* Theme Filter */}
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-slate-500">Linked Theme</label>
              <select 
                value={activeTheme}
                onChange={(e) => updateFilter("theme", e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 shadow-sm"
              >
                <option value="all">All Themes</option>
                {themes.map(t => (
                  <option key={t.theme_id} value={t.theme_id}>{t.theme_name}</option>
                ))}
              </select>
            </div>

            {/* Opportunity Filter */}
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-slate-500">Opportunity Area</label>
              <select 
                value={activeOpportunity}
                onChange={(e) => updateFilter("opportunity", e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 shadow-sm"
              >
                <option value="all">All Opportunities</option>
                {opportunities.map(o => (
                  <option key={o.opportunity_id} value={o.opportunity_id}>{o.opportunity_name}</option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* Evidence List */}
        <div className="col-span-9 space-y-8">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="animate-spin w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full mx-auto" />
              <p className="text-slate-400 text-sm font-medium italic">Loading evidence...</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                   {filtered.length} items {hasActiveFilters ? "matching filters" : "found"}
                 </p>
              </div>
              
              <div className="space-y-12">
                {filtered.map((ev) => (
                  <div key={ev.id} className="group">
                    <EvidenceQuote 
                      evidence={ev} 
                      linkedThemes={ev.theme_name ? [ev.theme_name] : []}
                    />
                  </div>
                ))}
                
                {filtered.length === 0 && (
                  <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-xl">
                    <p className="text-slate-400 text-sm font-medium italic">No evidence items match your filters.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EvidencePage() {
  return (
    <Suspense fallback={<div className="text-slate-500 text-sm">Loading...</div>}>
      <EvidenceContent />
    </Suspense>
  );
}
