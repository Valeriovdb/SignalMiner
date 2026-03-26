#!/bin/bash
# SignalMiner data pipeline — run this once to collect and analyze feedback.
# Usage: cd SignalMiner && bash scripts/run_pipeline.sh

set -e

echo "=== SignalMiner Data Pipeline ==="
echo ""

# Ensure we're in project root
if [ ! -f ".env" ]; then
  echo "ERROR: .env file not found. Create one with OPENAI_API_KEY=sk-..."
  exit 1
fi

mkdir -p data

echo "[1/5] Scraping Google Play Store..."
python3 scripts/scrape_playstore.py

echo ""
echo "[2/5] Scraping Reddit..."
python3 scripts/scrape_reddit.py

echo ""
echo "[3/5] Scraping Garmin Forums..."
python3 scripts/scrape_forums.py

echo ""
echo "[4/5] Normalizing and merging..."
python3 scripts/normalize.py

echo ""
echo "[5/5] Analyzing with OpenAI..."
python3 scripts/analyze.py

echo ""
echo "=== Pipeline complete. data/analyzed_output.json is ready. ==="
