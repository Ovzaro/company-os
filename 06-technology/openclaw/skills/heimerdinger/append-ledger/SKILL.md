---
name: append-ledger
description: Append newly-created HubSpot leads to the Excel ledger (B2B Product Leads.xlsx) — append-only, idempotent on HubSpot Deal ID, one row per created lead.
---

# Append to the Excel Ledger

Run this when leads have been created in HubSpot. Sweep the run sheet for completed rows carrying a
`hubspot_deal_id` that isn't yet in the sheet, and append one row each. **You are read-only in HubSpot
— never create or edit deals.** The ledger is sacred: append-only, never an overwrite.

## File
- **`~/Documents/B2B Product Leads.xlsx`** — use Python / `openpyxl`.
- If it doesn't exist, create it with the header row first.

## Columns (in order)
`Date Added`, `Deal Name (website)`, `Company`, `Stage`, `Owner`, `Celeb` (display name, e.g.
"Brooke Burke" — the display name, **not** the internal `Joe Theismann` value Viktor writes),
`Celeb Category`, `Industry Category`, `Source / Channel` (from Ekko's `source_channel` on the run
sheet), `Time Zone`, `Description`, `Decision-Makers` (name / title / email / phone),
`Team Contact + Email`, `HubSpot Deal ID / Link`.

## Steps
1. **Load the run sheet** and select rows where the lead was **actually created** in HubSpot
   (`hubspot_status = written`) and carries a `hubspot_deal_id`.
2. **Open (or create) the workbook.** If new, write the header row from the Columns list above.
3. **De-dupe on Deal ID (idempotent):** read the Deal IDs already in the sheet; **skip any
   `hubspot_deal_id` already present.** This lets you sweep more than once safely.
4. **Append one row per new created lead** — map each field to its column; use the celeb **display
   name**. Pull the decision-maker and team-contact details from the run sheet.
5. **Save**, then mark `logged_to_excel = yes` on that run-sheet row.

## Hard rules
- **Append-only — never overwrite or edit earlier rows.**
- **Only log leads that were actually created** (skip duplicates / skipped leads).
- **Idempotent, keyed on HubSpot Deal ID** — one row per Deal ID, ever.
- Exact, not embellished — the record is a faithful mirror of what's in HubSpot.
