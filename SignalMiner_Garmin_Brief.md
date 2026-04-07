# SignalMiner — Garmin Ecosystem Project Brief

## 1. Project overview

**Project name:** SignalMiner  
**Portfolio positioning:** Senior Product Manager case study  
**Domain:** Connected fitness hardware + companion app  
**Target ecosystem:** Garmin Connect + Garmin wearables, with initial focus on **Fenix 7 Pro**  
**Status:** WIP

SignalMiner is a product insight tool concept designed to help Product Managers turn fragmented public feedback into structured discovery inputs.

For this case, the product domain is the **Garmin ecosystem**, because it combines:
- hardware
- companion app experience
- firmware / sync behavior
- data trust and metric interpretation
- support interactions
- subscription / premium feature perception

This makes it a strong use case for demonstrating senior PM skills in research synthesis, opportunity framing, prioritization, and trust-sensitive product thinking.

---

## 2. Problem

Product teams often receive feedback from many places, but struggle to transform scattered qualitative signals into a coherent view of:
- recurring pain points
- severity of problems
- confidence in the signal
- potential opportunity areas worth deeper discovery

In complex ecosystems like Garmin, feedback is especially fragmented because users discuss issues across:
- app store reviews
- Reddit communities
- official forums
- product reviews
- support pages
- retailer reviews

This creates a real PM challenge:

> How can we distinguish isolated complaints from repeated, strategically relevant product signals?

---

## 3. Objective

Build a portfolio-grade concept and prototype for a tool that:
- ingests publicly available user feedback from multiple sources
- clusters feedback into recurring pain points and themes
- distinguishes **frequency** from **severity**
- assigns a **confidence score** to recurring signals
- highlights **opportunity areas** for discovery prioritization
- supports roadmap input without pretending to produce false precision

The output should help answer:
- What problems are recurring across the Garmin ecosystem?
- Which issues appear most disruptive to core user value?
- Which signals are strong enough to justify deeper product discovery?
- Which opportunity areas are likely to matter most for retention, trust, activation, or monetization?

---

## 4. Scope

### In scope

Initial focus:
- **Garmin Connect app**
- **Fenix 7 Pro**
- adjacent Garmin ecosystem feedback when relevant (sync, firmware, data accuracy, training metrics, premium features)

Likely feedback domains:
- onboarding and setup
- device pairing / sync reliability
- app performance and stability
- firmware update friction
- data trust and metric consistency
- health / fitness metric interpretation
- battery, connectivity, and notification issues
- premium / subscription value perception
- support experience
- feature discoverability / UX friction

### Out of scope

- building a complete production-grade data pipeline for all Garmin products
- generating a mathematically rigorous roadmap score
- claiming causal product conclusions from public feedback alone
- replacing direct user research, customer interviews, or internal product telemetry

SignalMiner should be positioned as a **decision-support system for discovery prioritization**, not as an autonomous roadmap engine.

---

## 5. Why this is a strong PM portfolio case

This project demonstrates PM work that is highly valuable but often invisible:
- synthesizing messy qualitative input
- identifying repeat patterns across channels
- separating noise from signal
- framing opportunity areas before jumping to solutions
- applying lightweight prioritization logic to ambiguous evidence
- managing trust-sensitive product domains where users care deeply about reliability and data credibility

This should feel like:
- a senior PM case about opportunity identification
- not just an AI summarization demo
- not just a dashboard of complaints

---

## 6. Core product framing

### Product thesis

SignalMiner helps PMs discover high-confidence opportunity areas by converting fragmented feedback into structured insight.

### Positioning statement

> SignalMiner is a discovery-prioritization tool that clusters fragmented public feedback into recurring pain points, confidence-weighted themes, and strategic opportunity areas.

### Key principle

Do **not** overclaim precision.

The tool should not say:
- “This should be top roadmap priority.”

It should say:
- “This is a repeated, high-confidence signal worth discovery attention.”

---

## 7. Main workflow

The core workflow should follow this logic:

1. **Ingest feedback**  
   Collect publicly available feedback from selected sources.

2. **Normalize and clean**  
   Remove duplicates, standardize metadata, detect source, date, product references, and probable topic.

3. **Cluster into themes**  
   Group related comments into recurring pain points or jobs-to-be-done.

4. **Label and structure**  
   Turn raw clusters into interpretable themes such as:
   - sync reliability
   - metric trust
   - notification inconsistency
   - premium value confusion
   - setup friction

5. **Estimate prioritization signals**  
   For each theme, derive lightweight signals such as:
   - frequency
   - severity
   - confidence
   - strategic relevance

6. **Surface opportunity areas**  
   Translate pain clusters into PM-friendly opportunity framing.

7. **Support discovery prioritization**  
   Help the PM identify which areas deserve deeper validation through interviews, telemetry, or internal investigation.

---

## 8. Prioritization logic

This is a key part of the case study and should be explicit.

SignalMiner is **not** intended to create a fake quantitative roadmap score.
Instead, it should support prioritization through a small number of interpretable signals.

### Proposed dimensions

#### 1. Frequency
How often does a pain point appear?
- repeated across many feedback items
- repeated over time
- repeated across multiple sources

#### 2. Severity
How disruptive does the issue appear?
Examples:
- blocks core workflow
- breaks trust in product data
- causes abandonment or churn intent
- creates major frustration but is still recoverable
- minor annoyance / cosmetic complaint

#### 3. Confidence
How strong is the evidence that this is a real recurring signal?
Confidence should increase when:
- the issue appears across multiple source types
- the issue is described consistently
- there is enough evidence volume
- the issue is recent and repeated

Confidence should decrease when:
- the signal appears only once or twice
- the wording is highly ambiguous
- the problem is too product-specific or edge-case-based
- source quality is weak

#### 4. Strategic relevance
How closely does the pain point connect to key product outcomes?
Example relevance dimensions:
- activation / successful onboarding
- retention / ongoing engagement
- trust in core metrics and insights
- upgrade or premium willingness
- ecosystem loyalty

### Output philosophy

The tool should output **directional prioritization support**, for example:
- high-frequency, medium-severity, high-confidence
- low-frequency, high-severity, medium-confidence
- medium-frequency, high strategic relevance, high-confidence

This is much more credible than a single “priority score.”

---

## 9. Example opportunity framing

The output should move beyond complaint summaries and suggest PM-style opportunity areas.

Examples:

### Theme: Sync reliability
Observed signals:
- delayed syncing
- missing activities or metrics
- repeated pairing friction after updates

Possible opportunity area:
> Improve trust and continuity in device-to-app synchronization for high-engagement users.

### Theme: Metric trust
Observed signals:
- confusion about HRV / readiness / sleep metrics
- perceived inconsistency in values
- users questioning whether the app or watch is accurate

Possible opportunity area:
> Improve explainability and trust around advanced health and training metrics.

### Theme: Premium value perception
Observed signals:
- confusion about paid vs free capabilities
- skepticism about subscription value
- concern about features being locked or degraded

Possible opportunity area:
> Clarify premium value proposition without undermining trust in the base product experience.

---

## 10. Target users

Primary user:
- Product Manager working on a connected fitness ecosystem

Secondary users:
- UX researcher
- product analyst
- support / CX lead
- design lead

Main PM jobs-to-be-done:
- identify recurring user problems from scattered inputs
- prepare discovery hypotheses
- spot trust-damaging issues early
- structure qualitative feedback into themes for quarterly planning
- support prioritization discussions with evidence, not anecdotes

---

## 11. Data sources

Start with public sources that are easy to explain in a portfolio case.

### Recommended first-wave sources
- Google Play reviews for Garmin Connect
- Reddit discussions (Garmin-related subreddits)
- Garmin official forums
- public product reviews / retailer reviews when useful
- Garmin support / help content as contextual metadata, not user sentiment

### Important note
Support pages should not be treated as “feedback.”  
They are useful as context to understand product areas and known issue categories.

### Source-level considerations
Each feedback item should ideally store metadata such as:
- source
- date
- product reference
- probable topic
- raw text
- normalized text
- link / citation if used in UI

---

## 12. UX / UI direction

The UI should feel modern, analytical, and product-facing.

### Experience principles
- do not overwhelm the user with raw comments first
- show structured themes before individual quotes
- always separate **signal** from **evidence**
- make it clear where the insight came from
- make confidence visible
- avoid “AI magic” aesthetics or overclaiming certainty

### Suggested core screens

#### 1. Overview dashboard
Purpose:
- quick view of recurring themes and opportunity areas

Potential modules:
- top recurring themes
- theme distribution by category
- high-confidence opportunity areas
- recent signal shifts
- source mix

#### 2. Theme explorer
Purpose:
- inspect clusters in more detail

Potential modules:
- theme title and summary
- sample evidence excerpts
- frequency / severity / confidence indicators
- source distribution
- related themes
- product areas affected

#### 3. Opportunity view
Purpose:
- translate pain clusters into PM-ready framing

Potential modules:
- opportunity statement
- supporting evidence themes
- confidence level
- strategic relevance tags
- suggested discovery next steps

#### 4. Evidence drill-down
Purpose:
- let the PM inspect the raw signal behind the abstraction

Potential modules:
- source cards
- raw feedback excerpts
- source type / date / product reference
- filters by source and time window

### Design tone
Aim for:
- clean, minimal, premium
- closer to a modern analytics product than to a developer demo
- high readability
- strong information hierarchy
- subtle use of cards, filters, and tags

Avoid:
- cluttered dashboards
- too many empty widgets
- fake precision charts
- overly decorative AI branding

---

## 13. Key product/design decisions to showcase

Claude should treat these as deliberate PM decisions, not implementation details.

### Decision 1
**Do not output a single priority score.**  
Reason: scattered qualitative data does not justify false precision.

### Decision 2
**Use confidence as a first-class concept.**  
Reason: not all recurring complaints deserve the same trust.

### Decision 3
**Separate signal from evidence.**  
Reason: PMs need interpretable synthesis, but also need to inspect raw feedback.

### Decision 4
**Translate themes into opportunity areas.**  
Reason: the product should support discovery, not merely summarize complaints.

### Decision 5
**Prioritize cross-source consistency.**  
Reason: issues repeated across app reviews, forums, and communities are more credible than isolated comments.

---

## 14. What makes this better than a simple LLM summary

This is important for the portfolio narrative.

SignalMiner should not be framed as “paste reviews into an LLM and get bullets.”

The value is in:
- repeatable structure
- clustering across many inputs
- explicit distinction between frequency, severity, and confidence
- traceability back to evidence
- opportunity framing for PM workflows
- support for discovery prioritization over time

A normal summary tells you what people said.  
SignalMiner should help you decide what is worth investigating next.

---

## 15. Suggested MVP

The MVP should be intentionally focused and portfolio-friendly.

### MVP goal
Demonstrate that public feedback about Garmin Connect / Fenix 7 Pro can be transformed into structured discovery signals.

### MVP scope
- ingest a limited set of public feedback sources
- clean and normalize comments
- cluster into 5–10 recurring themes
- assign directional frequency / severity / confidence
- surface 3–5 opportunity areas
- provide evidence drill-down for each cluster

### MVP success criteria
A user can:
- understand the major recurring pain themes
- inspect representative evidence behind each theme
- distinguish between weak and strong signals
- identify which areas deserve deeper discovery attention

---

## 16. Nice-to-have features later

Possible extensions after MVP:
- time trends by theme
- source comparison by theme
- shift detection / emerging issues
- filtering by product family or device line
- quote extraction and deduplication improvements
- opportunity history over time
- ability to compare two product ecosystems

---

## 17. Risks and guardrails

### Risks
- overfitting on vocal online users
- mistaking anecdotal frustration for product-wide insight
- poor clustering quality creating misleading themes
- too much abstraction reducing trust
- overclaiming prioritization rigor

### Guardrails
- always expose representative evidence
- make confidence visible
- avoid single-number decision outputs
- use clear language like “signal,” “theme,” and “opportunity area,” not “truth” or “root cause”
- present outputs as discovery inputs, not final prioritization answers

---

## 18. Portfolio narrative

The project should be presented as a demonstration of replicable PM skills.

### Core story
> I built SignalMiner to explore how a PM can turn fragmented public feedback into structured, confidence-weighted discovery inputs. I chose the Garmin ecosystem because it combines hardware, app UX, trust-sensitive metrics, subscriptions, and support complexity — making it a strong environment for identifying recurring pain points and shaping opportunity areas.

### Replicable PM skills demonstrated
- research synthesis across fragmented qualitative inputs
- pattern recognition and signal clustering
- taxonomy and theme design
- opportunity framing before solutioning
- prioritization under ambiguity
- trust-sensitive product thinking
- evidence-based communication for discovery planning

---

## 19. Deliverables Claude should aim to produce

Claude can help with some or all of the following:

### Product outputs
- product summary / one-pager
- case study narrative for portfolio
- opportunity statements
- feature hypotheses / next-step discovery questions
- PRD-style framing for the concept

### UX outputs
- information architecture
- dashboard wireframe ideas
- UI copy
- labels for theme categories / confidence states / evidence views

### Technical / prototyping outputs
- data model proposal
- ingestion / normalization workflow proposal
- clustering / labeling approach
- scoring logic proposal for frequency, severity, confidence
- mock dashboard or app prototype

---

## 20. Instructions for Claude

Use this file as the source of truth for the project.

When helping on this project:
- behave like a senior product partner, not just a code generator
- challenge weak assumptions
- avoid fake precision
- separate product framing from implementation choices
- prefer a small, strong MVP over an overbuilt system
- keep the product credible as a PM portfolio case
- optimize for clarity, structure, and seniority of thinking

Always preserve this core positioning:

> SignalMiner is a discovery-prioritization tool, not a roadmap automation engine.

When suggesting features or UI:
- prioritize explainability
- prioritize evidence traceability
- keep confidence visible
- translate complaints into opportunity areas
- avoid dashboards full of vanity widgets

When suggesting analysis logic:
- distinguish frequency from severity
- treat confidence as a separate dimension
- do not collapse everything into a single score unless there is a very good reason

---

## 21. Short version for quick reuse

**SignalMiner** is a PM-focused concept that ingests fragmented public feedback from the Garmin ecosystem and converts it into recurring pain themes, confidence-weighted signals, and opportunity areas for discovery prioritization. It is designed to help Product Managers move from anecdotal feedback to structured insight without overclaiming roadmap precision.

---

## 22. Current implementation state

### Stack
- Next.js frontend (`/frontend`) — dark theme, Tailwind CSS
- Python backend with a bundled fallback dataset (Garmin Connect feedback)
- Deployed on Vercel (frontend), backend via separate service

### Overview page — current design decisions

The Overview page (`/frontend/app/page.tsx`) is implemented as a **PM decision-support screen**, not an analytics dashboard.

#### Page sections (in order of visual weight)
1. **Hero** — editorial synthesis headline; section label and quiet metadata
2. **Priority areas** — 4 ranked cards with `0X` rank markers, left-border accent by type (violet / amber / orange), type pills, competitive note where relevant
3. **Competitive context** — pressure map table with 4 columns (Dimension, Garmin today, Competitor pressure, Business implication); pressure dots (3 dots = high, 2 = medium) as the visual cue on each dimension row
4. **What the evidence suggests** — 5 compact insight panels in a 2-column grid; two-tone: white headline + muted body
5. **Top signals** — 6 signal cards with a 2px colored top strip by type (blue = Garmin, violet = cross-platform, amber = competitive); small signal-type label in matching muted color
6. **Questions for discovery** — numbered rows (`01`–`05`) with larger question text; designed to feel like a working discussion tool

#### Visual hierarchy principles applied
- Section headers: `text-[10px] uppercase tracking-[0.15em] text-slate-400` — act as navigational labels, not competing headlines
- Hero headline: `text-[2.1rem] tracking-tight` — largest element on the page
- Priority cards: `bg-slate-800/50` — visually elevated above page background (`bg-slate-900` or equivalent)
- Metadata: `text-[10px] text-slate-700` — nearly invisible, purely informational
- Spacing: `space-y-20` between sections for clear page rhythm

#### What is deliberately excluded from the Overview
- KPI cards / stat blocks
- Line charts, donut charts, bar charts
- Decorative AI branding
- Raw complaint counts as primary signal

#### Key editorial content
The synthesis statement driving the page:
> "Users don't mainly complain about missing metrics — they complain that training data doesn't reliably become useful guidance."

The 4 priority areas (from opportunity data, sorted by priority):
1. Enhance training feedback — Strategic opportunity
2. Improve data sync — Trust risk
3. Expand third-party integrations — Competitive pressure
4. Enhance performance analytics — Strategic opportunity

The 5 competitive dimensions tracked:
- Coaching clarity (high pressure)
- Sync reliability (high pressure)
- Third-party integrations (medium)
- Data trust & accuracy (medium)
- Subscription / value (medium)
