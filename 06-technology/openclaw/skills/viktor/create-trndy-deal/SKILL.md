---
name: create-trndy-deal
description: Final-validate and create one approved TRNDY HubSpot deal in the browser — de-dupe, fields, owner/stage, contacts, verify, and preserve CRM integrity.
---

# Create a TRNDY HubSpot Deal

Run this every time you create a single **approved** TRNDY lead in HubSpot. Follow the steps in order
— never skip final de-dupe. TRNDY's CRM only; never SnapFund. Work in the logged-in `openclaw`
Chrome.

The CRM is the company's permanent record. Nothing enters it until it has earned its place: approved,
validated, de-duplicated, accurately written, and verified.

## CRM execution standard — browser only

Google Chrome is the only approved workflow for HubSpot operations. All CRM actions must mirror what
a trained human operator would do inside HubSpot:

- Navigate HubSpot through the shared `openclaw` Chrome profile.
- Perform live de-duplication through the browser.
- Create Deals through the browser.
- Populate fields and contacts through the browser.
- Verify creation through the browser.
- Read created Deal IDs through the browser.

Do **not** use HubSpot APIs for normal CRM creation, de-duplication, validation, field writing, or
verification. Do **not** use API tokens as an alternative workflow.

**You only INPUT.** Ekko already found the company + celeb and Jayce already found the decision-makers,
titles, emails, and phones — it's all in the run sheet. You don't source companies or find contacts
yourself. If a required field is missing from the run sheet, **flag it back to Nexus** rather than
going to find it.

Viktor participates twice in the workflow:
- **Stage 1 — Early HubSpot de-dupe:** after Ekko sourcing, check whether sourced companies already
  exist before Jayce spends enrichment effort. Do not create records in Stage 1.
- **Stage 2 — Final validation + write:** after Jayce Contact Intelligence and Jacob approval, run
  final HubSpot de-dupe immediately before writing, then create only still-clear records.

## Inputs (from the run sheet)
- `website`/domain, company/brand name, category
- `decision_makers[]` ({name, title, email, phone}), `team_contact` (if any), the **primary** email
- `selected_celeb` (display name), `industry_category`, `time_zone` (derive from the US HQ location)

## Step 1 — De-dupe (mission-critical; SKIP the lead if ANY check matches)
Perform this live in HubSpot through the shared Chrome profile:

1. Open the **Master Lead Check** board; search the company's **website/domain** (e.g. `goflaus.com`).
2. Search the **company name** (e.g. "Flaus").
3. In the **global search bar (top-left)**, search **each contact email**.

**How to read checks 1–2 (important):** a hit is **not** only an exact-name match. If the search
surfaces a **different company** — a parent, subsidiary, sister, or otherwise related company — then
this lead is **already in the system through that relative.** Treat it as a duplicate and SKIP.

Also treat as a duplicate: alternate domains, or any decision-maker / general email already in the
system. **Proceed only if all three checks come back empty.** If anything matches → set
`hubspot_status = skipped-duplicate`, write the reason to the run sheet, and stop.

This final check is authoritative even if the Stage 1 early de-dupe was clear. Never sacrifice CRM
integrity for speed.

## Step 2 — Build the deal
- **Deal name** = the website (e.g. `goflaus.com`).
- **Company name** = exactly ONE brand name (the lead's own). Never combine with slashes; parent /
  sister / subsidiary names go in the Description, not here.
- **Owner** = Jacob Stefanescu, owner ID **`76430723`** (never the board/sample-deal owner).
- **Stage** = **💚RTG (`1048885325`)** in "Sales Pipeline" — always, even for email-only leads.
- **General company info** = fill every known company / brand / website / URL field cleanly; don't
  leave known data for Jacob to backfill.
- **Manual properties:** `celeb_name`, `celeb_category`, `industry_category`, `time_zone`.
  - `celeb_name` quirk: for **Brooke Burke**, write **`Joe Theismann`**. All other celebs use their own name.
- **Description** (required) = **only** the company/brand name, plus any **parent company or
  subsidiary** name **and URL**. **Nothing else** — no addresses, research notes, caveats,
  contact/call/celeb notes, rationale, fit summaries, source notes, or enrichment notes.

## Step 3 — Contacts

**The email is what creates a contact in our system.** Every contact needs a valid email in the right
field — that's the trigger.

- **Titles must be the real role.** Enter each person's title exactly as the run sheet gives it —
  **`CEO`, `Founder`, `Co-Founder`**, etc. **Never** type a generic placeholder like "Decision Maker."
  If a real title is missing from the run sheet, **flag it back to Nexus** (Jayce finds titles) — don't
  invent one.
- **Primary decision-maker's email → `n3___dm_email`** (the field that creates/associates the contact).
  Do **not** use `dm_1_second_email` for it.
- **Every other decision-maker** (extra co-founders / execs) → its own **additional contact** on the
  deal, each with their real title. The **general/company email** → also added as an additional
  contact. De-dupe each first (global search); skip any email already tied to another lead/deal.
- **General "team" fallback contact** (when there's no named person): First Name = **"[Company] Team"**,
  **no last name, no title** — just the **email and/or phone number**, with the email in `n3___dm_email`.
- **Never** put a second email into `email_2` / secondary — make it a separate contact instead.
- **Email hygiene:** strip leading/trailing and hidden whitespace, lowercase/normalize, validate, and
  **confirm the value actually wrote into `n3___dm_email`** before reporting success.

## Step 4 — Add the lead
HubSpot workflows handle company creation, contact association, and workflow-driven fields. **If a
workflow doesn't fire — e.g. the contacts don't get created or associated — add the contacts in
manually yourself.** New records only; never edit existing records, delete, or merge.

Create the Deal manually in the HubSpot UI through Chrome. Do not create it through an API request,
script, token-backed integration, or any non-browser workflow.

## Step 5 — Verify & record
- Open the created deal and confirm: owner `76430723`, stage 💚RTG, deal name, single company name,
  `celeb_name` (with the Joe Theismann mapping if Brooke), and that `n3___dm_email` populated.
- Read the created Deal ID from the browser, then write `hubspot_status = written` and the new
  `hubspot_deal_id` to the run sheet.
- Honor the pacing Nexus gives you (one create per the 5–15 min window) — never burst.

## Permanent-record standard
- Every write must be intentional.
- Every write must be accurate.
- Every write must be verified.
- Every write must be repeatable.
- Nothing enters the CRM until it has earned its place.
