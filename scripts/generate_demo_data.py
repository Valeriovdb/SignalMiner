"""
Generates static demo JSON files from analyzed_output.json.
Output matches the exact response format of each FastAPI endpoint,
so the frontend can use them as a drop-in fallback.

Output:
  frontend/public/data/demo/overview.json
  frontend/public/data/demo/themes.json
  frontend/public/data/demo/opportunities.json
  frontend/public/data/demo/evidence.json
"""

import json
from pathlib import Path

SOURCE_LABELS = {
    "google_play": "Google Play",
    "reddit": "Reddit",
    "garmin_forums": "Garmin Forums",
}
PLATFORM_LABELS = {
    "garmin": "Garmin",
    "polar": "Polar",
    "coros": "COROS",
    "strava": "Strava",
    "cross_platform": "Cross-Platform",
    "general": "General",
}

src = Path("data/analyzed_output.json")
if not src.exists():
    raise FileNotFoundError("data/analyzed_output.json not found. Run the pipeline first.")

with open(src) as f:
    d = json.load(f)

out_dir = Path("frontend/public/data/demo")
out_dir.mkdir(parents=True, exist_ok=True)

meta = d["meta"]
themes = d["themes"]
opportunities = d["opportunities"]

# ── Enrich evidence items with platform (inherited from theme) ──────────────
for theme in themes:
    for ev in theme.get("evidence", []):
        if "platform" not in ev:
            ev["platform"] = theme.get("platform", "garmin")
        ev["platform_label"] = PLATFORM_LABELS.get(ev["platform"], ev["platform"])

# ── overview.json ───────────────────────────────────────────────────────────
overview = {
    "meta": meta,
    "theme_count": len(themes),
    "opportunity_count": len(opportunities),
    "competitive_theme_count": sum(1 for t in themes if t.get("competitive_signal")),
    "high_confidence_themes": [t for t in themes if t.get("confidence") == "high"],
    "sources": [
        {"key": k, "label": SOURCE_LABELS.get(k, k), "count": v}
        for k, v in meta.get("by_source", {}).items()
    ],
    "platforms": [
        {"key": k, "label": PLATFORM_LABELS.get(k, k), "count": v}
        for k, v in meta.get("by_platform", {}).items()
    ],
    "top_insights": d.get("top_insights", []),
    "executive_summary": d.get("executive_summary", ""),
    "competitive_landscape_summary": d.get("competitive_landscape_summary", ""),
}
with open(out_dir / "overview.json", "w") as f:
    json.dump(overview, f, indent=2)
print("  overview.json written")

# ── themes.json ─────────────────────────────────────────────────────────────
with open(out_dir / "themes.json", "w") as f:
    json.dump({"themes": themes}, f, indent=2)
print("  themes.json written")

# ── opportunities.json ───────────────────────────────────────────────────────
themes_by_id = {t["theme_id"]: t for t in themes}
opps_enriched = []
for opp in opportunities:
    o = dict(opp)
    o["linked_theme_objects"] = [
        themes_by_id[tid]
        for tid in opp.get("linked_theme_ids", [])
        if tid in themes_by_id
    ]
    opps_enriched.append(o)

with open(out_dir / "opportunities.json", "w") as f:
    json.dump({"opportunities": opps_enriched}, f, indent=2)
print("  opportunities.json written")

# ── evidence.json ────────────────────────────────────────────────────────────
all_evidence = []
seen_ids = set()
for theme in themes:
    for item in theme.get("evidence", []):
        if item["id"] not in seen_ids:
            seen_ids.add(item["id"])
            ev = dict(item)
            ev["theme_id"] = theme["theme_id"]
            ev["theme_name"] = theme["theme_name"]
            all_evidence.append(ev)

with open(out_dir / "evidence.json", "w") as f:
    json.dump({"evidence": all_evidence, "total": len(all_evidence)}, f, indent=2)
print(f"  evidence.json written ({len(all_evidence)} items)")

print(f"\nDemo data written to {out_dir}/")
print(f"  Themes: {len(themes)}, Opportunities: {len(opportunities)}, Evidence: {len(all_evidence)}")
