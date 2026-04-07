
# GEMINI.md

## Purpose
This file defines how to work in this project.
Treat it as operational guidance, not as the source of truth for project context.

Project-specific context should be read from the relevant project memory file(s), such as:
- `SignalMiner.md` (Source of truth)
- `README.md`
- relevant code files

---

## Working principles

- **Be high-signal:** Be concise, structured, and practical.
- **Challenge assumptions:** Question vague requirements or jargon.
- **Problem-first:** Separate problem framing from solutioning.
- **Simplicity:** Prefer readable, standard code over "clever" abstractions.
- **PM Audience:** Keep outputs useful for senior product managers.

---

## Design Standards (Redesign 2026)

### Visual Direction
- **Light Theme Only:** Use a white background (`bg-white`) and high-contrast text (`text-slate-900`).
- **Editorial Feel:** Prioritize readability and whitespace over decorative elements.
- **Minimal Styling:** Reduce card borders, shadows, and gradients. Use standard `slate` colors.
- **Sticky Nav:** Keep the top navigation visible for context.

### Information Architecture
- **Overview:** Executive research summary. Answers: What is the pattern? What are the top 3 priorities? How were they ranked?
- **Themes:** Pattern discovery. Answers: What are users saying? How large are the clusters? (Use List/Detail layout).
- **Opportunities:** Prioritization and business implication. Answers: Why focus here? What is the business risk?
- **Evidence:** The trust layer. Answers: What is the raw data? (Use rich filters and search).

### Reusable Patterns
- **`MetadataRow`:** Compact row for provenance (item count, sources, time range).
- **`ScoreExplanation`:** Plain-language explanation of how ranking/confidence is computed.
- **`EvidenceQuote`:** Clean, non-decorative display of raw user feedback with source links.

---

## Engineering Standards

- **Traceability:** Every synthesized insight must be traceable back to raw evidence.
- **Plain Language:** Avoid consultancy jargon (e.g., "strategic opportunity"). Use descriptive labels (e.g., "Frequent", "Severe").
- **Types:** Rigorously follow `frontend/lib/types.ts`.
- **Validation:** Always verify behavioural correctness before finality.

---

## How to approach tasks

### For product work
- Start from the user problem and business goal.
- Make assumptions explicit.
- Use plain, internal-tool language.

### For technical work
- Understand the existing architecture (`scripts/`, `backend/`, `frontend/`).
- Prefer surgical edits over broad rewrites.
- Flag hidden coupling or technical debt.

---

## Code conventions

- **Next.js:** Use App Router and Client Components (`"use client"`) where state is needed.
- **Tailwind:** Avoid custom CSS; use utility classes.
- **Lucide:** Use Lucide icons for UI elements.
- **Components:** Keep components focused and small.

---

## What good help looks like

- A clear recommendation with rationale and trade-offs.
- Traceable implementation (from data to UI).
- High-contrast, readable layouts.
