"""
SignalMiner FastAPI backend — Training Intelligence Gap
Serves analyzed_output.json to the Next.js frontend.
"""

import json
import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SignalMiner API", version="2.0.0")

_origins_env = os.environ.get("ALLOWED_ORIGINS", "")
ALLOWED_ORIGINS = [o.strip() for o in _origins_env.split(",") if o.strip()] or [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET"],
    allow_headers=["*"],
)

DATA_FILE = Path(__file__).parent.parent / "data" / "analyzed_output.json"


def load_data():
    if not DATA_FILE.exists():
        raise HTTPException(
            status_code=503,
            detail="Analysis data not yet generated. Run: bash scripts/run_pipeline.sh",
        )
    with open(DATA_FILE) as f:
        return json.load(f)


@app.get("/api/health")
def health():
    return {"status": "ok", "data_available": DATA_FILE.exists()}


@app.get("/api/overview")
def overview():
    data = load_data()
    themes = data.get("themes", [])
    opportunities = data.get("opportunities", [])
    meta = data.get("meta", {})

    source_labels = {
        "google_play": "Google Play",
        "reddit": "Reddit",
        "garmin_forums": "Garmin Forums",
    }
    platform_labels = {
        "garmin": "Garmin",
        "polar": "Polar",
        "coros": "COROS",
        "strava": "Strava",
        "cross_platform": "Cross-Platform",
        "general": "General",
    }

    return {
        "meta": meta,
        "theme_count": len(themes),
        "opportunity_count": len(opportunities),
        "competitive_theme_count": sum(1 for t in themes if t.get("competitive_signal")),
        "high_confidence_themes": [t for t in themes if t.get("confidence") == "high"],
        "sources": [
            {"key": k, "label": source_labels.get(k, k), "count": v}
            for k, v in meta.get("by_source", {}).items()
        ],
        "platforms": [
            {"key": k, "label": platform_labels.get(k, k), "count": v}
            for k, v in meta.get("by_platform", {}).items()
        ],
        "top_insights": data.get("top_insights", []),
        "executive_summary": data.get("executive_summary", ""),
        "competitive_landscape_summary": data.get("competitive_landscape_summary", ""),
    }


@app.get("/api/themes")
def get_themes(platform: str = None, competitive: bool = None):
    data = load_data()
    themes = data.get("themes", [])
    if platform:
        themes = [t for t in themes if t.get("platform") == platform]
    if competitive is not None:
        themes = [t for t in themes if t.get("competitive_signal") == competitive]
    return {"themes": themes}


@app.get("/api/themes/{theme_id}")
def get_theme(theme_id: str):
    data = load_data()
    theme = next((t for t in data.get("themes", []) if t["theme_id"] == theme_id), None)
    if not theme:
        raise HTTPException(status_code=404, detail="Theme not found")
    return theme


@app.get("/api/opportunities")
def get_opportunities():
    data = load_data()
    themes_by_id = {t["theme_id"]: t for t in data.get("themes", [])}
    opportunities = data.get("opportunities", [])
    for opp in opportunities:
        opp["linked_theme_objects"] = [
            themes_by_id[tid]
            for tid in opp.get("linked_theme_ids", [])
            if tid in themes_by_id
        ]
    return {"opportunities": opportunities}


@app.get("/api/evidence")
def get_evidence(source: str = None, platform: str = None, theme_id: str = None):
    data = load_data()
    themes = data.get("themes", [])

    all_evidence = []
    seen_ids = set()

    for theme in themes:
        if theme_id and theme["theme_id"] != theme_id:
            continue
        for item in theme.get("evidence", []):
            if item["id"] not in seen_ids:
                seen_ids.add(item["id"])
                item["theme_id"] = theme["theme_id"]
                item["theme_name"] = theme["theme_name"]
                all_evidence.append(item)

    if source:
        all_evidence = [e for e in all_evidence if e.get("source") == source]
    if platform:
        all_evidence = [e for e in all_evidence if e.get("platform") == platform]

    return {"evidence": all_evidence, "total": len(all_evidence)}
