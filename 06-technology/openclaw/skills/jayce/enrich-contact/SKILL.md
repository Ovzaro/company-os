---
name: enrich-contact
description: Identify the highest-authority reachable decision maker, keep investigation evidence internal, verify work email/phone through RocketReach, and deliver only execution-ready contacts for Viktor.
---

# Enrich Contact Intelligence

Run this every time you enrich a qualified, de-dupe-cleared company.

Inherit and follow:

- `03-ai-workforce/shared/INVESTIGATION_ENGINE.md`
- `03-ai-workforce/shared/EVIDENCE_ACQUISITION_PLAYBOOK.md`

They are the single source of truth for investigation state, evidence acquisition, mandatory
LinkedIn/RocketReach enrichment, validation, and completion. This skill contains only Jayce-specific
output and handoff rules.

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

Prefer a verified local company phone number.

If no verified local company phone exists, use the best verified company phone available.

A verified toll-free number is acceptable only when no verified local company number exists.

If no verified company email exists:

1. Include the verified contact form.
2. If no verified contact form exists, explicitly state:

   "No verified company communication route found."

Never silently omit Contact 3.

Remove LinkedIn URLs from the delivery package. Remove investigation notes, reasoning, confidence,
search history, evidence, and RocketReach notes.

## Success Standard

A successful investigation gives Sales the highest possible probability of speaking with someone who
can say "yes."

Never stop because you found a person. Stop because you found the right person.

## Shared Investigation Sources

Use `03-ai-workforce/shared/EVIDENCE_ACQUISITION_PLAYBOOK.md` for required investigation states,
search order, LinkedIn discovery, RocketReach enrichment, and validation.

Use `03-ai-workforce/shared/INVESTIGATION_ENGINE.md` for investigation completion. Company/general
contact fallback is allowed only after the shared evidence-acquisition process has been reasonably
exhausted.

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

## Select Contacts

### Primary Contact

Select the highest-authority reachable decision maker reasonably identified. Authority outranks
convenience.

### Communication Route Fallback

When a named decision maker has been successfully identified, never replace the named decision maker
with a generic company contact. The named decision maker always remains Contact 1.

If the Evidence Acquisition Playbook cannot obtain a verified direct email or verified direct phone
after reasonable investigation, keep the named decision maker and use the strongest verified company
communication route for that person.

Preferred communication route order:

1. Verified company email
2. Preferred verified local company phone
3. Best verified company phone
4. Verified contact form

The communication route belongs to the named decision maker. It does not replace the named decision
maker.

A missing direct email or direct phone is never a reason to remove a verified decision maker. The
identity of the decision maker and the communication route are separate concepts. Company
communication routes exist to reach the identified decision maker.

Never replace:

```text
Named Decision Maker
```

with:

```text
Company Team
```

Instead produce:

```text
Contact 1

Named Decision Maker

Title

Email:
Verified Company Email

Phone:
Verified Company Phone

Communication Route:
Company Email + Company Phone
```

The identity of the decision maker never changes.

Only the communication route changes.

### Secondary Contact

Select the strongest useful secondary path when available: co-founder, executive operator, marketing
leader, growth leader, partnerships leader, ecommerce leader, or another credible navigator.

### Optional Contact 3

Create Contact 3 only when it materially improves Sales' chance of reaching the company. If Contact 3
is incomplete because no verified company email or contact form exists, explicitly state: "No
verified company communication route found." Never silently omit Contact 3.

When Contact 3 represents a company communication route instead of a named person, format the
contact as:

- First Name = `"[Company Name] Team"`
- Last Name = blank
- Title = blank unless a verified department title exists

Examples:

- The Silicone Kitchen Team
- FLI Products Team
- Goo-eez Team

Never split the company name into first name and last name.

Never invent a person's name.

This formatting applies only to Contact 3 (Communication Route).

### Company Contact

Company contact is never the preferred outcome.

Company contact may become the primary route only after `fallback_after_exhaustion`. It must never be
selected because it was easier.

When fallback is required:

- First Name = `"[Company] Team"`
- Last Name = blank
- Title = blank
- Use the best verified company email and phone available
- Prefer a verified local company phone number. If no verified local company phone exists, use the
  best verified company phone available. A verified toll-free number is acceptable only when no
  verified local company number exists.
- If no verified company email exists, include the verified contact form. If no verified contact form
  exists, explicitly state: "No verified company communication route found."
- Do not invent a title

## Investigation Status

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

## Final Self-Check

Before ending an investigation, apply the completion and validation rules in
`03-ai-workforce/shared/INVESTIGATION_ENGINE.md` and
`03-ai-workforce/shared/EVIDENCE_ACQUISITION_PLAYBOOK.md`.

## Email and Phone Hygiene

- Normalize every email: trim leading/trailing whitespace, remove hidden whitespace, lowercase where
  appropriate, and validate the final string.
- Deliver verified work email and verified work phone when available.
- Do not place alternate emails into a secondary email slot.
- Do not deliver personal, guessed, stale, or unsupported data as verified.

## Write the Run Sheet

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
