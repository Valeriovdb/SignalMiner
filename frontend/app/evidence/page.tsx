"use client";

import { useEffect, useState } from "react";
import { fetchEvidence } from "@/lib/api";
import { Evidence } from "@/lib/types";
import { EvidenceCard } from "@/components/EvidenceCard";

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
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [source, setSource] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (source !== "all") params.source = source;
    if (platform !== "all") params.platform = platform;
    fetchEvidence(Object.keys(params).length ? params : undefined)
      .then((data) => setEvidence(data.evidence))
      .catch((e) => setError(e.message));
  }, [source, platform]);

  const filtered = search.trim()
    ? evidence.filter((e) => e.text.toLowerCase().includes(search.toLowerCase()))
    : evidence;

  if (error) return <p className="text-red-400 text-sm">{error}</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Evidence</h1>
        <p className="text-slate-400 text-sm mt-1">Raw feedback behind the signal clusters</p>
      </div>

      {/* Filters */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {SOURCE_FILTERS.map((f) => (
            <FilterButton key={f.key} label={f.label} active={source === f.key} onClick={() => setSource(f.key)} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {PLATFORM_FILTERS.map((f) => (
            <FilterButton key={f.key} label={f.label} active={platform === f.key} onClick={() => setPlatform(f.key)} />
          ))}
        </div>
        <input
          type="text"
          placeholder="Search evidence..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <p className="text-xs text-slate-500">{filtered.length} items</p>

      <div className="space-y-3">
        {filtered.map((ev) => (
          <EvidenceCard key={ev.id} evidence={ev} />
        ))}
        {filtered.length === 0 && (
          <p className="text-slate-500 text-sm py-8 text-center">No evidence items found.</p>
        )}
      </div>
    </div>
  );
}

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs border transition-colors ${
        active ? "border-indigo-500 text-indigo-300 bg-indigo-500/10" : "border-slate-700 text-slate-400 hover:border-slate-500"
      }`}
    >
      {label}
    </button>
  );
}
