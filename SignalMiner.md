# SignalMiner — Training Intelligence Gap

## 1. Overview

A PM portfolio case study and working prototype. SignalMiner mines public feedback across the connected fitness training category to surface recurring pain themes, competitive gaps, and opportunity areas in the training features and coaching subdomain.

**Scope:** Deliberately narrow — training plans, coaching recommendations, training load, performance analytics, post-activity insights, and third-party integrations.

**Platforms covered:** Garmin Connect, Polar Flow, COROS, Strava.

**Positioning:** Discovery-prioritization tool for the training intelligence gap. Not a roadmap engine, not a complaint dashboard.

---

## 2. Problem

Garmin leads the market in connected fitness hardware but faces growing pressure on the software coaching layer. Users increasingly collect data with Garmin but seek training intelligence elsewhere — through TrainingPeaks, COROS Training Hub, or Polar Flow. Product teams need a way to identify where the coaching and analytics experience is falling short, and where competitors are capturing the value Garmin has not yet delivered.

---

## 3. Product Thesis

> Garmin Connect captures more training data than any competitor, but users seeking actionable coaching intelligence increasingly turn to third-party tools. SignalMiner identifies where this gap is largest, which competitors are filling it, and which problems are worth investigating first.

---

## 4. Scope

**In scope:**
- Training features and coaching intelligence subdomain only
- Platforms: Garmin Connect, Polar Flow, COROS (via cross-mentions), Strava
- Three data sources: Google Play, Reddit, Garmin Forums
- Competitive comparison signals (when users explicitly compare or switch platforms)
- One-shot data collection (no live pipeline)

**Out of scope:**
- Health metrics, sync bugs, device hardware, onboarding, notifications
- Other Garmin product lines unrelated to training
- Internal telemetry or interview data
- Single numerical priority score

---

## 5. Architecture

```
scripts/
  scrape_playstore.py   Google Play — Garmin Connect, Polar Flow, Strava
  scrape_reddit.py      Reddit — Garmin, GarminFenix, Polarfitness, AdvancedRunning,
                        triathlon, running, Strava + training/competitive search queries
  scrape_forums.py      Garmin Forums — running/multisport + Fenix boards
  normalize.py          Merge → data/raw_feedback.json (with platform field)
  analyze.py            OpenAI clustering → data/analyzed_output.json
  run_pipeline.sh       Run all steps in sequence

backend/
  main.py               FastAPI — /api/overview, /themes, /opportunities, /evidence

frontend/
  Next.js + Tailwind + shadcn/ui
  Pages: Overview, Themes (with platform + competitive filters), Opportunities, Evidence
```

---

## 6. Data Model

Each feedback item carries:
- `source`: google_play | reddit | garmin_forums
- `platform`: garmin | polar | coros | strava | cross_platform | general
- `text`, `date`, `rating` (if available), `url`

Each theme carries:
- `platform`: which product the theme primarily affects
- `surface`: training_plans | coaching_recommendations | training_load | performance_analytics | workout_suggestions | post_activity_insights | third_party_integrations | competitive_comparison
- `issue_type`: missing_capability | poor_actionability | data_accuracy_trust | competitive_gap | workflow_friction
- `competitive_signal`: boolean — true when users compare or defect to a competitor
- `competitor_mentioned`: name of competitor if applicable

Each opportunity carries:
- `competitive_context`: how competitors are handling this area
- `suggested_product_direction`: PM-level direction, not a feature spec

Output also includes:
- `competitive_landscape_summary`: cross-platform comparison paragraph
- `top_insights`: 4-6 key PM takeaways
- `executive_summary`: portfolio-ready paragraph

---

## 7. Key Product Decisions

| Decision | Rationale |
|---|---|
| Narrow to training features subdomain | Broad Garmin analysis is too diffuse for a PM portfolio case; training is a bounded, strategically interesting domain |
| Category-level mining (not just Garmin) | Competitive gaps only become visible when you see what users say about alternatives |
| Competitive signal as first-class concept | When users route around a platform for training, that is a strategic PM signal |
| No single priority score | Qualitative public data does not justify false precision |
| Confidence as explicit dimension | Not all recurring complaints deserve the same trust |
| Opportunity framing, not feature lists | The tool supports discovery, not solutioning |

---

## 8. Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router) + Tailwind CSS + shadcn/ui |
| Backend | FastAPI (Python) |
| Analysis | OpenAI gpt-4o-mini (per chunk) + gpt-4o (synthesis) |
| Scraping | google-play-scraper, requests + BeautifulSoup, Reddit public JSON |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 9. Environment Setup

```bash
# 1. Create .env in project root
echo "OPENAI_API_KEY=sk-..." > .env

# 2. Install Python deps
pip3 install google-play-scraper requests beautifulsoup4 openai python-dotenv pandas fastapi uvicorn

# 3. Run the pipeline (once)
bash scripts/run_pipeline.sh

# 4. Start backend
cd backend && python3 -m uvicorn main:app --reload

# 5. Start frontend
cd frontend && npm install && npm run dev
```

---

## 10. Constraints

- Data is a point-in-time snapshot — not live
- COROS has no Play Store app; COROS signal comes through cross-mentions in Reddit/forums
- Reddit public API: no auth, limited to top/hot/new posts
- Garmin Forums: HTML scraping, fragile if layout changes
- Analysis cost: ~$2–3 per full pipeline run (gpt-4o-mini + gpt-4o)

---

## 11. Open Questions

- Should the pipeline support time-windowed re-runs to detect trend shifts?
- Should the UI expose a competitive comparison view (Garmin vs Polar side by side)?
- Should opportunity areas link to specific discovery methods (survey, interview, telemetry)?
