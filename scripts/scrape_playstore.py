"""
Scrape training app reviews from the Google Play Store.
Covers Garmin Connect, Polar Flow, and Strava.
No API key required.
"""

import json
from google_play_scraper import reviews, Sort

APPS = [
    {
        "app_id": "com.garmin.android.apps.connectmobile",
        "platform": "garmin",
        "label": "Garmin Connect",
        "count": 250,
    },
    {
        "app_id": "fi.polar.polarflow",
        "platform": "polar",
        "label": "Polar Flow",
        "count": 200,
    },
    {
        "app_id": "com.strava",
        "platform": "strava",
        "label": "Strava",
        "count": 150,
    },
]


def scrape():
    all_reviews = []

    for app in APPS:
        print(f"  Fetching {app['label']} ({app['app_id']})...")
        try:
            result, _ = reviews(
                app["app_id"],
                lang="en",
                country="us",
                sort=Sort.NEWEST,
                count=app["count"],
            )
            print(f"    Retrieved {len(result)} reviews")
            for r in result:
                text = (r.get("content") or "").strip()
                if not text:
                    continue
                all_reviews.append({
                    "source": "google_play",
                    "source_label": "Google Play",
                    "platform": app["platform"],
                    "platform_label": app["label"],
                    "date": str(r.get("at", ""))[:10],
                    "rating": r.get("score"),
                    "title": "",
                    "text": text,
                    "product_reference": app["label"],
                    "url": f"https://play.google.com/store/apps/details?id={app['app_id']}",
                })
        except Exception as e:
            print(f"    Failed: {e}")

    return all_reviews


if __name__ == "__main__":
    print("Fetching Google Play reviews...")
    data = scrape()
    with open("data/raw_playstore.json", "w") as f:
        json.dump(data, f, indent=2, default=str)
    print(f"Saved {len(data)} Play Store reviews to data/raw_playstore.json")
