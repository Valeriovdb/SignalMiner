"""
Scrape training-focused posts from Reddit.
Covers Garmin, Polar, Strava communities plus running/triathlon subreddits.
COROS signal is captured through cross-mentions in search queries.
No authentication required.
"""

import json
import time
import requests

HEADERS = {"User-Agent": "SignalMiner/1.0 (portfolio research tool)"}

# Subreddit listing targets
TARGETS = [
    {"subreddit": "Garmin", "sort": "top", "limit": 75, "platform": "garmin"},
    {"subreddit": "Garmin", "sort": "hot", "limit": 50, "platform": "garmin"},
    {"subreddit": "Garmin", "sort": "new", "limit": 50, "platform": "garmin"},
    {"subreddit": "GarminFenix", "sort": "top", "limit": 75, "platform": "garmin"},
    {"subreddit": "GarminFenix", "sort": "hot", "limit": 40, "platform": "garmin"},
    {"subreddit": "Polarfitness", "sort": "top", "limit": 50, "platform": "polar"},
    {"subreddit": "Polarfitness", "sort": "hot", "limit": 30, "platform": "polar"},
    {"subreddit": "AdvancedRunning", "sort": "hot", "limit": 40, "platform": "general"},
    {"subreddit": "AdvancedRunning", "sort": "top", "limit": 40, "platform": "general"},
    {"subreddit": "triathlon", "sort": "hot", "limit": 30, "platform": "general"},
    {"subreddit": "triathlon", "sort": "top", "limit": 30, "platform": "general"},
    {"subreddit": "running", "sort": "hot", "limit": 25, "platform": "general"},
    {"subreddit": "Strava", "sort": "top", "limit": 40, "platform": "strava"},
    {"subreddit": "Strava", "sort": "hot", "limit": 30, "platform": "strava"},
]

# Targeted search queries for training features and competitive comparisons
SEARCH_TARGETS = [
    # Garmin training features
    {"subreddit": "Garmin", "query": "training plan coaching", "limit": 25, "platform": "garmin"},
    {"subreddit": "Garmin", "query": "training load suggested workouts", "limit": 25, "platform": "garmin"},
    {"subreddit": "Garmin", "query": "garmin coach daily suggested", "limit": 25, "platform": "garmin"},
    {"subreddit": "GarminFenix", "query": "training analytics workout", "limit": 25, "platform": "garmin"},
    # Competitive comparisons — COROS
    {"subreddit": "Garmin", "query": "coros training", "limit": 25, "platform": "garmin"},
    {"subreddit": "Garmin", "query": "switched coros", "limit": 20, "platform": "garmin"},
    {"subreddit": "AdvancedRunning", "query": "coros garmin training", "limit": 25, "platform": "general"},
    {"subreddit": "triathlon", "query": "coros garmin training", "limit": 20, "platform": "general"},
    # Competitive comparisons — Polar
    {"subreddit": "Garmin", "query": "polar training load", "limit": 20, "platform": "garmin"},
    {"subreddit": "AdvancedRunning", "query": "polar garmin training", "limit": 25, "platform": "general"},
    # Competitive comparisons — Strava
    {"subreddit": "Garmin", "query": "strava training", "limit": 20, "platform": "garmin"},
    {"subreddit": "AdvancedRunning", "query": "strava training analysis", "limit": 20, "platform": "general"},
    # TrainingPeaks as workaround signal
    {"subreddit": "Garmin", "query": "trainingpeaks", "limit": 20, "platform": "garmin"},
    {"subreddit": "AdvancedRunning", "query": "trainingpeaks garmin", "limit": 20, "platform": "general"},
    # Polar community — training specific
    {"subreddit": "Polarfitness", "query": "training load polar flow", "limit": 25, "platform": "polar"},
    {"subreddit": "Polarfitness", "query": "vs garmin", "limit": 20, "platform": "polar"},
]


def fetch_listing(subreddit, sort="hot", limit=25):
    url = f"https://www.reddit.com/r/{subreddit}/{sort}.json?limit={limit}"
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        r.raise_for_status()
        return r.json().get("data", {}).get("children", [])
    except Exception as e:
        print(f"  Warning: r/{subreddit}/{sort}: {e}")
        return []


def fetch_search(subreddit, query, limit=25):
    url = f"https://www.reddit.com/r/{subreddit}/search.json"
    params = {"q": query, "restrict_sr": 1, "sort": "top", "limit": limit}
    try:
        r = requests.get(url, headers=HEADERS, params=params, timeout=15)
        r.raise_for_status()
        return r.json().get("data", {}).get("children", [])
    except Exception as e:
        print(f"  Warning: search r/{subreddit} '{query}': {e}")
        return []


def detect_platform(text, default_platform):
    """Refine platform detection based on post content."""
    text_lower = text.lower()
    mentions = {
        "coros": "coros" in text_lower,
        "polar": any(w in text_lower for w in ["polar ", "polar flow", "vantage", "pacer"]),
        "strava": "strava" in text_lower,
        "garmin": any(w in text_lower for w in ["garmin", "fenix", "forerunner", "garmin connect"]),
    }
    mentioned = [p for p, v in mentions.items() if v]
    if len(mentioned) > 1:
        return "cross_platform"
    if len(mentioned) == 1:
        return mentioned[0]
    return default_platform


def normalize_post(post_data, default_platform):
    d = post_data.get("data", {})
    text = d.get("selftext", "").strip()
    title = d.get("title", "").strip()
    if not title:
        return None
    if text in ("[removed]", "[deleted]"):
        text = ""
    combined = f"{title}. {text}".strip(". ") if text else title
    if len(combined) < 20:
        return None

    platform = detect_platform(combined, default_platform)

    return {
        "source": "reddit",
        "source_label": "Reddit",
        "platform": platform,
        "platform_label": platform.replace("_", " ").title(),
        "date": str(d.get("created_utc", "")),
        "rating": None,
        "title": title,
        "text": combined,
        "product_reference": platform.replace("_", " ").title(),
        "url": f"https://reddit.com{d.get('permalink', '')}",
        "subreddit": d.get("subreddit", ""),
        "score": d.get("score", 0),
    }


def scrape():
    posts = []
    seen_ids = set()

    for target in TARGETS:
        subreddit = target["subreddit"]
        sort = target.get("sort", "hot")
        limit = target.get("limit", 25)
        platform = target.get("platform", "general")
        print(f"  r/{subreddit}/{sort} (limit={limit})...")
        items = fetch_listing(subreddit, sort, limit)
        for item in items:
            post_id = item.get("data", {}).get("id")
            if post_id and post_id not in seen_ids:
                seen_ids.add(post_id)
                normalized = normalize_post(item, platform)
                if normalized:
                    posts.append(normalized)
        time.sleep(1)

    for target in SEARCH_TARGETS:
        subreddit = target["subreddit"]
        query = target["query"]
        limit = target.get("limit", 20)
        platform = target.get("platform", "general")
        print(f"  Search r/{subreddit} '{query}'...")
        items = fetch_search(subreddit, query, limit)
        for item in items:
            post_id = item.get("data", {}).get("id")
            if post_id and post_id not in seen_ids:
                seen_ids.add(post_id)
                normalized = normalize_post(item, platform)
                if normalized:
                    posts.append(normalized)
        time.sleep(1)

    return posts


if __name__ == "__main__":
    print("Fetching Reddit posts...")
    data = scrape()
    with open("data/raw_reddit.json", "w") as f:
        json.dump(data, f, indent=2, default=str)

    from collections import Counter
    platforms = Counter(p["platform"] for p in data)
    print(f"Saved {len(data)} Reddit posts to data/raw_reddit.json")
    for p, c in platforms.most_common():
        print(f"  {p}: {c}")
