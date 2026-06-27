---
name: enrich-contact
description: Identify the true decision maker/economic buyer and best verified contact path — website + title-rotation search → LinkedIn URL → RocketReach, registry/ZoomInfo as fallback, then write confidence-scored contacts to the run sheet.
---

# Enrich a Lead's Contacts

Run this every time you enrich a qualified, de-dupe-cleared company. Work the ladder in order before
accepting a company/general contact as primary. Work in the logged-in
`openclaw` Chrome (RocketReach + brand sites + LinkedIn share one session).

**You only FIND.** Ekko already sourced and qualified the company; Viktor will de-dupe against the CRM
and write HubSpot. You don't qualify companies, run HubSpot de-dupe, or decide stage/owner/deal shape.
Your job is to identify the true decision maker/economic buyer — the person most likely to approve
and sign the engagement — and surface the best verified contact path for Sales. **Never make Sales
guess who to contact.**

**Fallback is not a shortcut.** A fallback is the result of a completed investigation. A
company/general contact must never become Contact 1 simply because it is easy to find.

## Inputs (from the run sheet)
- Companies with `search_status = qualified` **and** `dedupe_check = clear`.
- Per company: `website`/domain and company/brand name.

## Step 1 — Official website
Open the company's own website and collect evidence before using fallback paths. Check the homepage,
footer, Contact page, press links, founder story, and social links. Capture clues such as a spouse,
first name, founder quote, press mention, or social handle; those clues must drive follow-up searches
before fallback is accepted.

## Step 2 — Leadership / About pages
Check About / Our Story / Team / Founders / Leadership / Press for named
decision-makers and their **real titles**. Prioritize authority: owner, founder, CEO, co-founder,
president, managing partner, or the highest authority reasonably identifiable.

## Required decision-maker hierarchy
Search for Contact 1 in this order. Move downward only when the higher-authority level cannot be
reasonably identified.

1. **Primary economic buyer:** Founder, Co-Founder, Owner, CEO, President, Managing Partner,
   Principal, Chairman, Executive Chairman.
2. **Executive leadership if needed:** COO, CMO, CFO, Chief Growth Officer, Chief Revenue Officer,
   Chief Operating Officer, Chief Marketing Officer, Chief Commercial Officer.
3. **Department leadership if needed:** VP Marketing, Marketing Director, Brand Director, Growth
   Director, Ecommerce Director, Partnerships Director, Business Development Director.

Stop searching additional titles only after you have confidently identified the highest-authority
decision maker appropriate for that company.

## Step 3 — Targeted Google title rotation
Search the domain, company name, and title combinations to surface the right person. Required search
patterns include:
  ```
  {domain} founder linkedin
  {domain} co-founder linkedin
  {domain} owner linkedin
  {domain} ceo linkedin
  {domain} president linkedin
  {domain} managing partner linkedin
  {domain} principal linkedin
  {domain} COO linkedin
  {domain} CMO linkedin
  {domain} CFO linkedin
  {domain} VP Marketing linkedin
  "{company}" founder
  "{company}" co-founder
  "{company}" owner
  "{company}" CEO
  "{company}" president
  "{company}" CMO
  "{company}" COO
  site:linkedin.com/in "{company}"
  ```
If the website reveals clues, continue with clue searches before fallback:
```
"{company}" Jon
"{company}" Jane
{domain} Jon linkedin
```
Capture the primary economic buyer first, then useful secondary contacts. Secondary contacts may
include marketing, growth, operations, COO, CMO, partnerships, or ecommerce leaders, but they do not
outrank the highest-authority buyer.

## Step 4 — Find the likely decision-maker's LinkedIn
Once you have a name, run:
```
{domain} First Last LinkedIn
```
Example:
```
batchbalanced.com Jane Smith linkedin
```
Locate the correct LinkedIn profile and **copy the full LinkedIn URL**. The LinkedIn URL is an
internal investigation tool for RocketReach and evidence. It is not a normal Sales-facing deliverable
or a substitute for a completed investigation.

## Step 5 — Verify contact info via RocketReach
- Paste the LinkedIn URL from Step 4 into RocketReach, then search by company/domain and person if
  needed, to pull that person's RocketReach record.
- Pull the **verified email + phone** for each decision-maker. Prefer RocketReach-verified over
  guessed/pattern emails — never fabricate an address to look thorough.
- If the primary decision maker lacks direct email/phone, keep them primary and attach the best
  available verified path: company email, company phone, contact form, LinkedIn URL, or another
  verified company channel.
- Move human-like; **never bypass bot-detection or solve a CAPTCHA** — if you hit one, stop and flag Jacob.
- If RocketReach is unavailable, do **not** lower the investigation standard. Perform more careful
  Google, LinkedIn, public social, registry, ZoomInfo, and other public-source investigation. If the
  investigation cannot be completed, mark it `incomplete` rather than pretending enrichment is done.

## Step 6 — Public social and other reasonable sources
Review public social profiles if needed, then continue to other reasonable public sources. Always grab
the company/general contact (email + phone) as supporting information, but do not promote it to
Contact 1 unless the investigation ends in `fallback_after_exhaustion`.

If the website + title search + LinkedIn + RocketReach don't surface a real decision-maker:
- **State business registry** — search the company in its state's Secretary of State / business-entity
  registry; filings list the registered agent and officers (real names you can then run through
  RocketReach).
- **ZoomInfo** — a strong source for company people + contact info.
- Other reasonable public sources, including press, founder interviews, company social profiles, and
  credible directory/profile pages.

Only after these come up empty may you fall back to a company/team contact.

## Step 7 — Build the contacts (authority first, aim for up to 3)
- **Contact 1 — Primary decision maker / economic buyer.** Use the highest-authority person whenever
  reasonably identifiable, even if direct email/phone is limited. Include the best available contact
  path and explain the confidence.
- **Never make a company/general contact Contact 1 merely because it was easy to find.** It may be
  Contact 1 only as `fallback_after_exhaustion`, with reasoning that defends the completed
  investigation.
- **Contact 2 — Strong secondary contact** if there is one: marketing, growth, operations, COO, CMO,
  partnerships, ecommerce, or a second founder/executive.
- **Contact 3 — Company/general contact** if necessary, especially when it is the best available path
  to reach the primary decision maker.

Mark which contact path is **primary**. If there is a primary email, Viktor writes it to
`n3___dm_email`; the others become additional contacts. Do not run HubSpot de-dupe yourself — Viktor
owns CRM de-dupe. The email is what creates a contact in our system, so normalize and validate every
email you provide.

## Step 8 — Team fallback after exhaustion (no named person at all)
If there's truly no named decision-maker after the full ladder, still pass the lead as
`fallback_after_exhaustion`: build a **team contact** — First Name = `"[Company] Team"`, **no last
name, no title** — using the best verified company channel: general company email, company phone,
contact form, company LinkedIn, or another verified route. A missing name is **not** a reason to skip;
only skip genuinely bad / dead / duplicate leads. Explain what you checked and why the fallback is the
next-best path.

## Step 9 — Investigation status
- `completed` — a named decision maker or defensible contact path was found after the ladder was
  worked.
- `incomplete` — RocketReach, Google/LinkedIn, or other required investigation paths could not be
  completed; do not present this as enriched.
- `fallback_after_exhaustion` — no named decision maker could be reasonably identified after the full
  ladder; a company/general path is the best available route.

The acceptance question is not "Did I find the founder?" It is "Did I complete a professional
investigation?"

## Step 10 — Email hygiene (operationally critical)
- **Normalize every email:** strip leading/trailing and hidden whitespace, lowercase/normalize,
  validate. A single stray space breaks HubSpot's contact association downstream.
- **Never stack a second email into one contact's secondary slot.** A second worthwhile email becomes
  its **own separate contact** — don't cram it into `email_2`.
- Keep the **primary** email clearly distinct from additional/general emails.

## Step 11 — Write to the run sheet & hand off
- `decision_makers[]` — each `{name, title, email, phone, linkedin_url, source, confidence,
  reasoning}` when possible.
- The **3-contact structure** (Contact 1 / Contact 2 / Contact 3 as built in Step 7).
- `team_contact` — only if the Step 8 fallback was used.
- The **primary contact path flag**.
- `investigation_status` = `completed`, `incomplete`, or `fallback_after_exhaustion`.
- `contact_status` = `enriched` (full), `partial` (person found but no verified email/phone — note
  what's missing), or `skipped` (with `skip_reason`).
- You surface the contacts; **Viktor** de-dupes them against the CRM and writes them. Don't message
  Jacob directly during a run — hand the run sheet back to Nexus.
