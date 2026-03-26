"""
Analyze normalized feedback using OpenAI.
Clusters feedback into themes, assigns frequency/severity/confidence,
and generates opportunity areas.
Output: data/analyzed_output.json
"""

import json
import os
import math
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

CHUNK_SIZE = 40  # items per OpenAI call to stay within token limits


def load_feedback():
    path = Path("data/raw_feedback.json")
    if not path.exists():
        raise FileNotFoundError("data/raw_feedback.json not found. Run normalize.py first.")
    with open(path) as f:
        return json.load(f)


def format_items_for_prompt(items):
    lines = []
    for i, item in enumerate(items):
        rating_str = f" [rating: {item['rating']}/5]" if item.get("rating") else ""
        platform = item.get("platform", "unknown")
        lines.append(
            f"[{i+1}] platform={platform} source={item['source_label']}{rating_str}\n{item['text'][:400]}"
        )
    return "\n\n".join(lines)


SYSTEM_PROMPT = """You are a senior product analyst helping a Product Manager analyze user feedback about the connected fitness training category.

The focus is narrow and deliberate: training features and coaching intelligence — specifically how platforms help athletes plan, execute, and understand their training. This includes training plans, coaching recommendations, training load analysis, workout suggestions, performance analytics, post-activity insights, and integration with third-party tools like TrainingPeaks or Strava.

Platforms in scope: Garmin Connect, Polar Flow, COROS, Strava. Each feedback item includes a platform field indicating which product is being discussed.

You will receive a batch of feedback items. Your task is to identify recurring pain themes related to training features and coaching.

Important rules:
- Focus only on training and coaching-related problems. Ignore general sync bugs, UI cosmetics, or unrelated hardware issues unless they directly affect training workflows.
- Group similar complaints into a single theme when they describe the same underlying user problem.
- Note which platform(s) a theme affects. If a theme appears across multiple platforms, mark it as cross_platform.
- Flag when users explicitly compare platforms or describe switching behavior — this is high-value competitive signal.
- Only create a theme if it is supported by at least 2 feedback items in the batch, unless the issue is clearly severe.
- Be conservative. Fewer, stronger themes are better than many weak ones.
- Distinguish between:
  - missing or weak features (the capability does not exist or is too basic)
  - poor actionability (data exists but does not help users make decisions)
  - trust and accuracy problems (users doubt whether the metrics are correct)
  - competitive gaps (users explicitly prefer or switch to a competitor for training)
  - workflow friction (the training workflow is present but hard to use)

For each theme, return:
- theme_id: short snake_case slug
- theme_name: concise human-readable label
- platform: one of [garmin, polar, coros, strava, cross_platform]
- surface: one of [training_plans, coaching_recommendations, training_load, performance_analytics, workout_suggestions, post_activity_insights, third_party_integrations, competitive_comparison, other]
- issue_type: one of [missing_capability, poor_actionability, data_accuracy_trust, competitive_gap, workflow_friction, regression_after_update, other]
- pain_type: one of [missing_capability, expectation_gap, friction, competitive_defection, trust_issue]
- summary: 1-2 sentence summary of the recurring problem
- problem_statement: one sentence describing what is going wrong from the user perspective
- user_impact: one sentence describing how this affects training decisions or behavior
- competitive_signal: true if this theme involves comparison to or defection toward a competitor platform
- mention_count: integer number of items in this batch supporting the theme
- severity: one of [low, medium, high]
- confidence: one of [low, medium, high]
- evidence_ids: list of item IDs from this batch
- strategic_relevance: list containing any of [engagement, retention, trust, premium_conversion, ecosystem_loyalty, churn_risk, competitive_differentiation]

Return ONLY valid JSON in this format:
{
  "themes": [
    {
      "theme_id": "...",
      "theme_name": "...",
      "platform": "...",
      "surface": "...",
      "issue_type": "...",
      "pain_type": "...",
      "summary": "...",
      "problem_statement": "...",
      "user_impact": "...",
      "competitive_signal": false,
      "mention_count": 0,
      "severity": "...",
      "confidence": "...",
      "evidence_ids": ["..."],
      "strategic_relevance": ["..."]
    }
  ]
}"""


def analyze_chunk(items):
    prompt_content = format_items_for_prompt(items)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Analyze these {len(items)} feedback items:\n\n{prompt_content}"},
        ],
        temperature=0.2,
        response_format={"type": "json_object"},
    )
    return json.loads(response.choices[0].message.content)


SYNTHESIS_PROMPT = """You are a senior product analyst synthesizing theme analysis across the connected fitness training category.

The scope is deliberately narrow: training features and coaching intelligence across Garmin Connect, Polar Flow, COROS, and Strava. You have been given themes extracted from multiple feedback batches. Many will be duplicates or near-duplicates.

Your job:
1. Merge duplicate or highly similar themes into unified final themes
2. Recalibrate frequency, severity, and confidence based on the full picture
3. Identify which themes represent competitive gaps — areas where users prefer or switch to a competitor specifically for training
4. Generate 3-5 PM-framed product opportunity areas

Important rules:
- Merge aggressively when themes reflect the same underlying user problem, even across platforms
- Keep themes user-problem oriented, not solution-oriented
- Distinguish clearly between:
  - missing or weak training capabilities (the feature gap)
  - poor actionability (data exists but doesn't help users decide)
  - competitive gaps (users explicitly going elsewhere for training intelligence)
  - trust issues specific to training metrics
  - workflow friction in training workflows
- Competitive gaps deserve extra attention: when users route around a platform for training, that is a strategic signal, not just a complaint
- Opportunity areas should be grounded in user pain and business impact. Frame them as: "what problem is worth investigating and why does it matter strategically" — not as feature descriptions

For each final merged theme, return:
- theme_id
- theme_name
- summary
- platform: one of [garmin, polar, coros, strava, cross_platform]
- surface: one of [training_plans, coaching_recommendations, training_load, performance_analytics, workout_suggestions, post_activity_insights, third_party_integrations, competitive_comparison, other]
- issue_type: one of [missing_capability, poor_actionability, data_accuracy_trust, competitive_gap, workflow_friction, regression_after_update, other]
- pain_type: one of [missing_capability, expectation_gap, friction, competitive_defection, trust_issue]
- problem_statement
- user_impact
- competitive_signal: true if this theme involves comparison to or defection toward another platform
- competitor_mentioned: name of competitor if applicable, or null
- aggregated_mentions: approximate total supporting mentions
- frequency: one of [low, medium, high]
- severity: one of [low, medium, high]
- confidence: one of [low, medium, high]
- strategic_relevance: list containing any of [engagement, retention, trust, premium_conversion, ecosystem_loyalty, churn_risk, competitive_differentiation]
- merged_from_theme_ids: list of chunk-level theme_ids

Then generate 3-5 opportunity areas. For each, return:
- opportunity_id: short snake_case slug
- opportunity_name: concise title
- user_problem: the broad training problem this opportunity addresses
- why_now: why this matters strategically — reference competitive context where relevant
- linked_theme_ids: list of final merged theme_ids that support this opportunity
- competitive_context: 1 sentence on how competitors are handling this area, or null if not applicable
- expected_business_impact: list containing any of [engagement, retention, trust, premium_conversion, ecosystem_loyalty, churn_risk, competitive_differentiation]
- suggested_product_direction: 1-2 sentences on the type of intervention a PM should explore — not a feature spec, but a direction
- confidence: one of [low, medium, high]
- priority: one of [low, medium, high]

Also return:
- competitive_landscape_summary: 2-3 sentences summarizing how Garmin, Polar, COROS, and Strava compare on training intelligence based on the evidence
- top_insights: 4-6 short bullets summarizing the most important takeaways for a PM
- executive_summary: a short paragraph suitable for a PM portfolio case study

Return ONLY valid JSON in this format:
{
  "final_themes": [
    {
      "theme_id": "...",
      "theme_name": "...",
      "summary": "...",
      "platform": "...",
      "surface": "...",
      "issue_type": "...",
      "pain_type": "...",
      "problem_statement": "...",
      "user_impact": "...",
      "competitive_signal": false,
      "competitor_mentioned": null,
      "aggregated_mentions": 0,
      "frequency": "...",
      "severity": "...",
      "confidence": "...",
      "strategic_relevance": ["..."],
      "merged_from_theme_ids": ["..."]
    }
  ],
  "opportunities": [
    {
      "opportunity_id": "...",
      "opportunity_name": "...",
      "user_problem": "...",
      "why_now": "...",
      "linked_theme_ids": ["..."],
      "competitive_context": null,
      "expected_business_impact": ["..."],
      "suggested_product_direction": "...",
      "confidence": "...",
      "priority": "..."
    }
  ],
  "competitive_landscape_summary": "...",
  "top_insights": ["..."],
  "executive_summary": "..."
}"""


def synthesize_themes(all_chunk_themes, all_items):
    # Build a lookup of item metadata by chunk-local IDs (we re-attach source info)
    theme_dump = json.dumps({"all_themes": all_chunk_themes}, indent=2)

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": SYNTHESIS_PROMPT},
            {"role": "user", "content": f"Synthesize and merge these themes from {len(all_items)} total feedback items across {len(all_chunk_themes)} raw themes:\n\n{theme_dump}"},
        ],
        temperature=0.2,
        response_format={"type": "json_object"},
    )
    return json.loads(response.choices[0].message.content)


def attach_evidence(themes, all_items):
    """
    For each theme, select up to 5 representative evidence items.
    We use a simple keyword match on theme summary + name.
    """
    for theme in themes:
        keywords = set(
            theme["theme_name"].lower().split() +
            theme["summary"].lower().split()
        )
        # Remove stopwords
        stopwords = {"the", "a", "an", "and", "or", "in", "of", "to", "is", "are", "for", "with", "that", "this", "it"}
        keywords -= stopwords

        matches = []
        for item in all_items:
            text_lower = item["text"].lower()
            score = sum(1 for kw in keywords if kw in text_lower)
            if score >= 2:
                matches.append((score, item))

        matches.sort(key=lambda x: -x[0])
        theme["evidence"] = [
            {
                "id": item["id"],
                "source": item["source"],
                "source_label": item["source_label"],
                "date": item.get("date"),
                "rating": item.get("rating"),
                "text": item["text"][:500],
                "url": item.get("url"),
                "product_reference": item.get("product_reference"),
            }
            for _, item in matches[:5]
        ]
    return themes


def build_source_stats(all_items):
    from collections import Counter
    sources = Counter(item["source"] for item in all_items)
    platforms = Counter(item.get("platform", "unknown") for item in all_items)
    return {
        "total_items": len(all_items),
        "by_source": dict(sources),
        "by_platform": dict(platforms),
    }


def analyze():
    print("Loading feedback...")
    all_items = load_feedback()
    print(f"  {len(all_items)} items loaded")

    # Split into chunks
    chunks = [all_items[i:i+CHUNK_SIZE] for i in range(0, len(all_items), CHUNK_SIZE)]
    print(f"  Analyzing in {len(chunks)} chunks of up to {CHUNK_SIZE} items...")

    all_raw_themes = []
    for i, chunk in enumerate(chunks):
        print(f"  Chunk {i+1}/{len(chunks)}...")
        result = analyze_chunk(chunk)
        all_raw_themes.extend(result.get("themes", []))

    print(f"  Raw themes identified: {len(all_raw_themes)}")
    print("  Synthesizing and merging themes...")

    synthesis = synthesize_themes(all_raw_themes, all_items)
    themes = synthesis.get("final_themes", [])
    opportunities = synthesis.get("opportunities", [])
    top_insights = synthesis.get("top_insights", [])
    executive_summary = synthesis.get("executive_summary", "")
    competitive_landscape_summary = synthesis.get("competitive_landscape_summary", "")

    print(f"  Final themes: {len(themes)}, Opportunities: {len(opportunities)}")
    print("  Attaching evidence to themes...")
    themes = attach_evidence(themes, all_items)

    output = {
        "meta": {
            "generated_at": __import__("datetime").datetime.utcnow().isoformat(),
            "model": "gpt-4o + gpt-4o-mini",
            **build_source_stats(all_items),
        },
        "themes": themes,
        "opportunities": opportunities,
        "top_insights": top_insights,
        "executive_summary": executive_summary,
        "competitive_landscape_summary": competitive_landscape_summary,
    }

    with open("data/analyzed_output.json", "w") as f:
        json.dump(output, f, indent=2)

    print("\nDone. Output saved to data/analyzed_output.json")
    return output


if __name__ == "__main__":
    analyze()
