"""
Scrape Garmin Connect reviews from the Apple App Store.
Uses Apple's public iTunes RSS/JSON API directly.
Garmin Connect App Store ID: 583446988
"""

import json
import requests

APP_ID = "583446988"
MAX_PAGES = 10  # Apple RSS returns up to 50 reviews per page, max 10 pages = 500 reviews


def fetch_page(page):
    url = f"https://itunes.apple.com/us/rss/customerreviews/page={page}/id={APP_ID}/sortBy=mostRecent/json"
    r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=15)
    r.raise_for_status()
    return r.json()


def scrape():
    print(f"Fetching App Store reviews for Garmin Connect (id={APP_ID})...")
    reviews = []

    for page in range(1, MAX_PAGES + 1):
        try:
            data = fetch_page(page)
            entries = data.get("feed", {}).get("entry", [])
            if not entries:
                print(f"  Page {page}: no entries, stopping")
                break
            # First entry on page 1 is app metadata, not a review
            if page == 1 and "im:name" in entries[0]:
                entries = entries[1:]
            for entry in entries:
                reviews.append({
                    "source": "app_store",
                    "source_label": "App Store",
                    "date": entry.get("updated", {}).get("label", "")[:10],
                    "rating": int(entry.get("im:rating", {}).get("label", 0)),
                    "title": entry.get("title", {}).get("label", ""),
                    "text": entry.get("content", {}).get("label", ""),
                    "product_reference": "Garmin Connect",
                    "url": None,
                })
            print(f"  Page {page}: {len(entries)} reviews (total so far: {len(reviews)})")
        except Exception as e:
            print(f"  Page {page}: error — {e}")
            break

    return reviews


if __name__ == "__main__":
    data = scrape()
    with open("data/raw_appstore.json", "w") as f:
        json.dump(data, f, indent=2)
    print(f"Saved {len(data)} App Store reviews to data/raw_appstore.json")
