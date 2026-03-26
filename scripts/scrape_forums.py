"""
Scrape Garmin forums — training and running/multisport focused boards.
"""

import json
import re
import time
import requests
from bs4 import BeautifulSoup

HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}

BOARDS = [
    {
        "url": "https://forums.garmin.com/sports-fitness/running-multisport/f/forerunner-965",
        "label": "Forerunner 965",
        "platform": "garmin",
        "product": "Garmin Forerunner",
    },
    {
        "url": "https://forums.garmin.com/sports-fitness/running-multisport/f/forerunner-955-series",
        "label": "Forerunner 955",
        "platform": "garmin",
        "product": "Garmin Forerunner",
    },
    {
        "url": "https://forums.garmin.com/sports-fitness/running-multisport/f/forerunner-265-series",
        "label": "Forerunner 265",
        "platform": "garmin",
        "product": "Garmin Forerunner",
    },
    {
        "url": "https://forums.garmin.com/outdoor-recreation/outdoor-recreation/f/fenix-7-series",
        "label": "Fenix 7 Series",
        "platform": "garmin",
        "product": "Garmin Fenix 7",
    },
    {
        "url": "https://forums.garmin.com/outdoor-recreation/outdoor-recreation/f/fenix-8-series",
        "label": "Fenix 8 Series",
        "platform": "garmin",
        "product": "Garmin Fenix 8",
    },
    {
        "url": "https://forums.garmin.com/apps-software/mobile-apps-web/f/garmin-connect-mobile-ios",
        "label": "Garmin Connect iOS",
        "platform": "garmin",
        "product": "Garmin Connect",
    },
    {
        "url": "https://forums.garmin.com/apps-software/mobile-apps-web/f/garmin-connect-mobile-andriod",
        "label": "Garmin Connect Android",
        "platform": "garmin",
        "product": "Garmin Connect",
    },
]

MAX_THREADS_PER_BOARD = 20
MAX_POSTS_PER_THREAD = 6

# Keywords to prioritize training-relevant threads
TRAINING_KEYWORDS = [
    "training", "coach", "workout", "plan", "load", "vo2", "lactate", "threshold",
    "interval", "tempo", "easy run", "long run", "suggested", "analytics", "performance",
    "race", "marathon", "triathlon", "cycling", "power", "strava", "polar", "coros",
    "trainingpeaks", "garmin coach", "daily suggested",
]


def get_thread_links(board_url):
    try:
        r = requests.get(board_url, headers=HEADERS, timeout=15)
        r.raise_for_status()
    except Exception as e:
        print(f"    Could not fetch board: {e}")
        return []

    soup = BeautifulSoup(r.text, "html.parser")
    links = []
    seen = set()

    for a in soup.find_all("a", href=True):
        href = a["href"]
        if re.search(r"/f/[^/]+/\d+/[^/\s]+", href) and href not in seen:
            seen.add(href)
            href_clean = href.split("?")[0]
            full = href_clean if href_clean.startswith("http") else "https://forums.garmin.com" + href_clean
            links.append((full, a.get_text(strip=True).lower()))
        if len(links) >= MAX_THREADS_PER_BOARD * 2:
            break

    # Prioritize training-relevant threads
    scored = []
    for url, title in links:
        score = sum(1 for kw in TRAINING_KEYWORDS if kw in title)
        scored.append((score, url))
    scored.sort(key=lambda x: -x[0])

    return [url for _, url in scored[:MAX_THREADS_PER_BOARD]]


def scrape_thread(url, product, platform):
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        r.raise_for_status()
    except Exception as e:
        return []

    soup = BeautifulSoup(r.text, "html.parser")

    title_el = soup.select_one("h1, .content-title, .page-title")
    title = title_el.get_text(strip=True) if title_el else ""

    bodies = soup.select("div.content.user-defined-markup, div.content.full.threaded-reply-content")[:MAX_POSTS_PER_THREAD]
    if not bodies:
        bodies = [d for d in soup.find_all("div", class_="content") if len(d.get_text(strip=True)) > 80][:MAX_POSTS_PER_THREAD]

    dates = soup.select("abbr.relative-date, time[datetime], .content-date")
    posts = []

    for i, body in enumerate(bodies):
        text = body.get_text(separator=" ", strip=True)
        if len(text) < 40:
            continue
        date_str = ""
        if i < len(dates):
            date_str = dates[i].get("title", "") or dates[i].get_text(strip=True)

        # Detect cross-platform mentions
        text_lower = text.lower()
        detected_platform = platform
        competitor_mentions = [p for p in ["coros", "polar", "strava", "trainingpeaks"] if p in text_lower]
        if competitor_mentions:
            detected_platform = "cross_platform"

        posts.append({
            "source": "garmin_forums",
            "source_label": "Garmin Forums",
            "platform": detected_platform,
            "platform_label": "Garmin" if detected_platform == "garmin" else "Cross-Platform",
            "date": date_str[:10] if date_str else None,
            "rating": None,
            "title": title,
            "text": text[:2000],
            "product_reference": product,
            "url": url,
        })

    return posts


def scrape():
    all_posts = []

    for board in BOARDS:
        print(f"  Scraping: {board['label']}...")
        thread_links = get_thread_links(board["url"])
        print(f"    Found {len(thread_links)} threads")

        for link in thread_links:
            posts = scrape_thread(link, board["product"], board["platform"])
            all_posts.extend(posts)
            time.sleep(0.6)

        time.sleep(1)

    return all_posts


if __name__ == "__main__":
    print("Fetching Garmin Forums posts...")
    data = scrape()
    with open("data/raw_forums.json", "w") as f:
        json.dump(data, f, indent=2)
    from collections import Counter
    platforms = Counter(p["platform"] for p in data)
    print(f"Saved {len(data)} forum posts to data/raw_forums.json")
    for p, c in platforms.most_common():
        print(f"  {p}: {c}")
