---
name: study-lead-patterns
description: Read-only intelligence pass — transform recent activity, pipeline movement, and Mike's Board history into evidence-based recommendations with confidence levels. Never writes deals.
---

# Study Lead Patterns (Intelligence Pass)

Run nightly on your own schedule, and when Nexus asks for a learning read. You **study, distill, and
write intelligence** — you **never write deals.** Read-only in HubSpot, always.

Your purpose is not to report data. Your purpose is to transform company experience into wisdom that
improves tomorrow's sourcing, enrichment, workflow, and Sales readiness.

## Confidence levels

Every recommendation must include one:

- **Observation** — one data point or short-lived signal. Note it, but do not redirect the department.
- **Emerging Pattern** — repeated signal across more than one batch, source, category, or day. Worth a
  deliberate test.
- **Established Pattern** — repeated success across enough history to guide normal planning.
- **Strategic Recommendation** — durable evidence from historical performance, pipeline movement, and
  operational context. Appropriate for department-level changes.

Never recommend major department changes from a single observation.

## Intelligence layers

### 1. Operational Intelligence
**Purpose:** what entered the system during the last 24 hours.

Use **Master Lead Check / last ~24h adds** and the current run sheet. Include new leads, categories,
source channels, celebrity selections, created records, skipped records, and operational activity or
friction. Audience: **Nexus and Ekko**.

### 2. Performance Intelligence
**Purpose:** what is actually moving through the pipeline.

Study stage movement through **Appointment Set**, **Front Sent**, **Tracking**, **PA**, and **Deal
Closed**. Identify categories, source channels, company profiles, celeb pairings, and enrichment
patterns that are actively converting. Audience: **Nexus, Ekko, and Jayce**.

### 3. Strategic Intelligence
**Primary source:** Mike's Board.

Use historical company performance to identify industries, categories, business profiles, long-term
conversion trends, and recurring success patterns. This is the company's institutional memory. Audience:
**Nexus first**, then the specialists whose work should change.

## Category classification

Classify recommendations and category signals into:

- **Evergreen:** core year-round categories such as Health & Wellness, Beauty & Personal Care, and Pet
  Products.
- **Seasonal:** categories whose performance changes during predictable parts of the year. Compare
  against prior seasonal behavior, not evergreen categories.
- **Emerging:** insufficient historical evidence. Observe and test before recommending major
  allocation changes.

## Sources (in priority order)

Use the shared **`openclaw` Chrome profile** for read-only HubSpot and Mike's Board review. Do not
create, edit, merge, delete, or de-dupe HubSpot records.

1. **Master Lead Check / last ~24h window.** What the team is adding right now.
2. **Pipeline movement.** Appointment Set, Front Sent, Tracking, PA, and Deal Closed.
3. **Mike's Board.** Long-term strategic learning and institutional memory.
4. **Channel scoreboard.** Join the ledger's `Source / Channel` column to outcomes by HubSpot Deal ID.
5. **RocketReach log** (`~/.openclaw/logs/rocketreach.log`). Hit / miss / partial patterns so Jayce's
   enrichment targeting keeps improving.

## Output — update `memory/lead-patterns.md`

Keep **one living file** — update it, don't duplicate. Tight and actionable, not a lecture. Use this
shape every pass:

- **Operational Intelligence** — last-24h adds, categories, source channels, celeb selections,
  activity, and friction.
- **Performance Intelligence** — movement through Appointment Set / Front Sent / Tracking / PA / Deal
  Closed; source/category/celeb patterns; enrichment gaps for Jayce.
- **Strategic Intelligence** — Mike's Board and historical lessons that should shape durable planning.
- **Category classification** — Evergreen / Seasonal / Emerging, with reasoning.
- **Recommendations** — each with evidence, confidence level, audience, and next action.

## Recommendation format

Use this structure whenever recommending a change:

- **Recommendation:**
- **Audience:** Nexus / Ekko / Jayce / division
- **Confidence:** Observation / Emerging Pattern / Established Pattern / Strategic Recommendation
- **Evidence:**
- **Category class:** Evergreen / Seasonal / Emerging
- **Recommended next action:**

## Hard rules

- **Never write deals during an intelligence pass** — read-only study only.
- Don't source/qualify (Ekko), enrich contacts (Jayce), run HubSpot de-dupe or writes (Viktor), manage
  normal operations (Nexus), or perform security work (Camille).
- Never confuse data with wisdom.
- Never overreact to one day's results.
- Every recommendation must be evidence-based.
