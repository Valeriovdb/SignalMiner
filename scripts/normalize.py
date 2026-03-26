"""
Merge all raw scraped sources into a single normalized JSON file.
Deduplicates, filters empty entries, and adds a unique ID per item.
Output: data/raw_feedback.json
"""

import json
import hashlib
import re
from pathlib import Path
from collections import Counter

SOURCE_FILES = [
    "data/raw_playstore.json",
    "data/raw_reddit.json",
    "data/raw_forums.json",
]

PLATFORM_KEYWORDS = {
    "garmin": ["garmin", "fenix", "forerunner", "garmin connect", "vivoactive"],
    "polar": ["polar flow", "polar vantage", "polar pacer", "polar ignite", "nightly recharge"],
    "coros": ["coros", "coros pace", "coros apex", "coros vertix", "evolab"],
    "strava": ["strava"],
    "trainingpeaks": ["trainingpeaks", "training peaks"],
}


def clean_text(text):
    if not text:
        return ""
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def make_id(item):
    key = f"{item['source']}|{item.get('url', '')}|{item['text'][:100]}"
    return hashlib.md5(key.encode()).hexdigest()[:12]


def normalize_date(date_str):
    if not date_str:
        return None
    try:
        ts = float(date_str)
        from datetime import datetime
        return datetime.utcfromtimestamp(ts).strftime("%Y-%m-%d")
    except (ValueError, TypeError):
        pass
    return str(date_str)[:10] if date_str else None


def infer_platform(item):
    """Fallback platform detection if not already set."""
    if item.get("platform"):
        return item["platform"]
    text = (item.get("text", "") + " " + item.get("title", "")).lower()
    detected = []
    for platform, keywords in PLATFORM_KEYWORDS.items():
        if any(kw in text for kw in keywords):
            detected.append(platform)
    if len(detected) > 1:
        return "cross_platform"
    if len(detected) == 1:
        return detected[0]
    return "general"


def load_and_merge():
    all_items = []
    for filepath in SOURCE_FILES:
        path = Path(filepath)
        if not path.exists():
            print(f"  Skipping {filepath} (not found)")
            continue
        with open(path) as f:
            items = json.load(f)
        print(f"  Loaded {len(items)} items from {filepath}")
        all_items.extend(items)

    seen_ids = set()
    normalized = []

    for item in all_items:
        text = clean_text(item.get("text", ""))
        if len(text) < 20:
            continue

        item["text"] = text
        item["title"] = clean_text(item.get("title", ""))
        item["date"] = normalize_date(item.get("date"))
        item["platform"] = infer_platform(item)
        item["platform_label"] = item.get("platform_label") or item["platform"].replace("_", " ").title()

        uid = make_id(item)
        if uid in seen_ids:
            continue
        seen_ids.add(uid)
        item["id"] = uid
        normalized.append(item)

    return normalized


if __name__ == "__main__":
    print("Normalizing and merging all sources...")
    data = load_and_merge()
    with open("data/raw_feedback.json", "w") as f:
        json.dump(data, f, indent=2, default=str)

    print(f"\nDone. {len(data)} unique feedback items saved to data/raw_feedback.json")
    sources = Counter(item["source"] for item in data)
    platforms = Counter(item["platform"] for item in data)
    print("\nBy source:")
    for s, c in sources.most_common():
        print(f"  {s}: {c}")
    print("\nBy platform:")
    for p, c in platforms.most_common():
        print(f"  {p}: {c}")
