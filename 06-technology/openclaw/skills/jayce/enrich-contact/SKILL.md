---
name: enrich-contact
description: Identify the highest-authority reachable decision maker, keep investigation evidence internal, verify work email/phone through RocketReach, and deliver only execution-ready contacts for Viktor.
---

# Enrich Contact Intelligence

Run this every time you enrich a qualified, de-dupe-cleared company.

Jayce's job is not to find contacts. Jayce's job is to identify the **highest-authority reachable
decision maker** and produce the highest-quality contact intelligence package possible.

The investigation belongs to the investigator. The execution belongs to the executor.

Jayce owns investigation. Viktor owns execution.

## Inputs

Work only companies with:

- `search_status = qualified`
- `dedupe_check = clear`
- Company or brand name
- Website or domain

Do not qualify companies, run HubSpot de-dupe, write HubSpot, decide stage, assign owner, or shape the
deal. Viktor owns CRM validation and execution.

## Required Product Split

Produce two separate products:

1. **Investigation Record** - internal only.
2. **CRM Delivery Package** - the only output Viktor receives.

Never mix these products.

## Product A - Investigation Record (Internal Only)

The Investigation Record is Jayce's private working notebook. It exists only to help Jayce
investigate professionally. It is not part of the run sheet, not part of the CRM delivery, and not
written into HubSpot.

It may contain:

- Searches
- Evidence
- LinkedIn URLs
- RocketReach evidence
- Reasoning
- Rejected candidates
- Confidence
- Investigation status
- Investigation timestamps
- Notes

This notebook belongs to Jayce. It is not transported through the run sheet and never gets handed to
Viktor.

## Product B - CRM Delivery Package (Viktor Only)

Deliver only execution-ready contact information:

- **Primary Contact**
  - First Name
  - Last Name
  - Title
  - Verified Email
  - Verified Phone
- **Secondary Contact**
  - First Name
  - Last Name
  - Title
  - Verified Email
  - Verified Phone
- **Optional Contact 3**
  - Only when it materially improves Sales' chance of reaching the company
  - First Name
  - Last Name
  - Title
  - Verified Email
  - Verified Phone
- **Company Contact**
  - Only after `fallback_after_exhaustion`

Remove LinkedIn URLs from the delivery package. Remove investigation notes, reasoning, confidence,
search history, evidence, and RocketReach notes.

## Success Standard

A successful investigation gives Sales the highest possible probability of speaking with someone who
can say "yes."

Never stop because you found a person. Stop because you found the right person.

## Authority Hierarchy

Search in this order. Only move down when the higher tier cannot be reasonably identified.

### Tier 1 - Economic Buyer

- Founder
- Co-Founder
- Owner
- CEO
- President
- Managing Partner
- Principal
- Chairman
- Executive Chairman

### Tier 2 - Executive Operator

- COO
- CMO
- CFO
- Chief Growth Officer
- Chief Revenue Officer
- Chief Operating Officer
- Chief Marketing Officer
- Chief Commercial Officer

### Tier 3 - Department Leader

- VP Marketing
- Marketing Director
- Brand Director
- Growth Director
- Ecommerce Director
- Partnerships Director
- Business Development Director

## Step 1 - Official Website

Open the company's own website first. Check:

- Homepage
- Footer
- Contact
- About
- Our Story
- Team
- Founders
- Leadership
- Press
- Blog or announcements
- Social links

Capture internal clues such as founder names, title clues, spouse or family references, first names,
quotes, press mentions, social handles, parent/subsidiary names, and location clues.

## Step 2 - Google Title Rotation

Search the domain, company name, and authority titles. Required searches include:

```text
{domain} founder linkedin
{domain} owner linkedin
{domain} ceo linkedin
{domain} president linkedin
{domain} managing partner linkedin
{domain} principal linkedin
site:linkedin.com/in "{company}"
site:linkedin.com/in "{company}" founder
site:linkedin.com/in "{company}" CEO
```

Also use title searches for Tier 2 and Tier 3 only when higher authority cannot be reasonably
identified.

## Step 3 - Clue-Based Searches

When the website reveals names, initials, family references, social handles, locations, or press
clues, pursue them before fallback.

Examples:

```text
"{company}" "{first name}"
{domain} "{first name}" linkedin
"{company}" "{last name}"
"{company}" founder "{city}"
"{company}" "{social handle}"
```

## Step 4 - LinkedIn Discovery

LinkedIn is an investigation tool.

Use LinkedIn to locate the correct person, confirm current company association, confirm authority,
and obtain the correct profile URL for RocketReach.

Once you have a likely name, search:

```text
{domain} First Last LinkedIn
```

Keep LinkedIn URLs in the Investigation Record. They are not part of Viktor's normal CRM handoff.

Use a dedicated LinkedIn account, never a personal one. Move human-like. Never bypass bot detection or
CAPTCHAs. If blocked, stop and flag through the normal run process.

## Step 5 - RocketReach Verification

RocketReach is used only after the correct person has been identified.

Use RocketReach to verify:

- Work email
- Work phone
- Company association

RocketReach should never determine authority. If RocketReach surfaces a lower-authority easy contact,
do not promote that person above a higher-authority decision maker identified through the
investigation.

Prefer RocketReach-verified work email and phone. Never fabricate an email, infer an unverified
pattern, or present guessed data as verified.

If RocketReach is unavailable, continue with careful Google, LinkedIn, and public-source
investigation. If required paths cannot be completed, mark the investigation `incomplete`.

## Step 6 - Public-Source Completion

If no proper named decision maker is confirmed, continue through reasonable public sources before
fallback:

- Public social profiles
- Press articles
- Founder interviews
- State Secretary of State or business registry records
- ZoomInfo or public directory previews
- Marketplace profiles
- Retailer/vendor pages
- Parent company pages

Only after these paths fail may you use a company/general contact as the primary route.

## Step 7 - Select Contacts

### Primary Contact

Select the highest-authority reachable decision maker reasonably identified. Authority outranks
convenience.

### Secondary Contact

Select the strongest useful secondary path when available: co-founder, executive operator, marketing
leader, growth leader, partnerships leader, ecommerce leader, or another credible navigator.

### Optional Contact 3

Create Contact 3 only when it materially improves Sales' chance of reaching the company. Otherwise
omit it entirely.

### Company Contact

Company contact is never the preferred outcome.

Company contact may become the primary route only after `fallback_after_exhaustion`. It must never be
selected because it was easier.

When fallback is required:

- First Name = `"[Company] Team"`
- Last Name = blank
- Title = blank
- Use the best verified company email and phone available
- Do not invent a title

## Step 8 - Investigation Status

Investigation status belongs to Jayce's internal Investigation Record. Track it for quality control
and run discipline, but do not include it in Viktor's CRM Delivery Package.

Use one status:

- `completed` - the highest-authority reachable decision maker was identified and verified well
  enough to deliver an execution-ready package.
- `partial` - the likely highest-authority decision maker was identified, but verified email or phone
  remains incomplete.
- `incomplete` - required investigation paths could not be completed.
- `fallback_after_exhaustion` - no named decision maker could be reasonably identified after the full
  ladder, and company contact is the best available route.

## Step 9 - Final Self-Check

Before ending the investigation, ask:

**"If I were the owner of this company, is this the first person I would want someone to call?"**

If the answer is no, continue investigating. Never stop because a person was found. Stop because the
right person was found.

## Step 10 - Email and Phone Hygiene

- Normalize every email: trim leading/trailing whitespace, remove hidden whitespace, lowercase where
  appropriate, and validate the final string.
- Deliver verified work email and verified work phone when available.
- Do not place alternate emails into a secondary email slot.
- Do not deliver personal, guessed, stale, or unsupported data as verified.

## Step 11 - Write the Run Sheet

The run sheet is not the investigation notebook. It is only the transport mechanism that carries
operational downstream information.

The run sheet must carry only:

- `primary_contact`
- `secondary_contact`
- `contact_3` only when materially useful
- `company_contact` only after `fallback_after_exhaustion`
- Operational fields required for downstream workflow

Contact fields must contain only:

- First Name
- Last Name
- Title
- Verified Email
- Verified Phone

Do not send Viktor LinkedIn URLs, investigation notes, confidence, reasoning, search history,
evidence, or RocketReach notes. Viktor executes. Jayce investigates.
