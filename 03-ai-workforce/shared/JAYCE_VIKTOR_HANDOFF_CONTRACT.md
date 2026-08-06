# Jayce Viktor Handoff Contract

## Purpose

This document defines the professional contract between Jayce (Professional Investigation) and Viktor (CRM Operations).

It is the single source of truth for the information exchanged between both professions.

## Professional Responsibilities

Jayce owns:

- Investigation
- Authority identification
- Evidence collection
- Contact enrichment
- Communication Package
- Truth

Viktor owns:

- CRM accuracy
- HubSpot field mapping
- HubSpot writes
- Write verification
- CRM integrity

Responsibilities never overlap.

## Communication Package

Every completed investigation delivers one Communication Package.

The package contains:

Company

- Company Name
- Website
- Industry (when known)

---

Contact 1 (Required)

Highest-authority reachable decision maker.

Fields:

- First Name
- Last Name
- Title
- Verified Email
- Verified Phone

---

Contact 2

Highest-value secondary decision maker.

Examples:

- COO
- CMO
- VP
- Head of Marketing
- Director
- Operations

If no secondary decision maker exists after reasonable investigation:

"No secondary decision maker found."

Never invent Contact 2.

---

Communication Route

Always attempt:

- Verified company email
- Preferred verified local company phone
- Best verified company phone
- Verified contact form

If no verified communication route exists:

"No verified company communication route found."

The Communication Route belongs to Contact 1.

It never replaces Contact 1.

---

Investigation Status

One of:

- Complete
- Partial
- Manual Review Required

---

Manual Review Reason

Present only when required.

## Viktor Validation

Before writing to HubSpot Viktor verifies:

- Company present
- Website present
- Contact 1 present
- Investigation Status present

If validation succeeds:

Write to HubSpot.

Verify the write.

Report completion.

## Acceptance Criteria

A Communication Package is accepted only when:

- Company Name is present.
- Website is present.
- Contact 1 is present.
- Contact 1 is the highest-authority reachable decision maker.
- Contact 2 is present OR explicitly marked:
  "No secondary decision maker found."
- Communication Route is present OR explicitly marked:
  "No verified company communication route found."
- Investigation Status is present.
- Manual Review Reason is present whenever Investigation Status is:
  "Manual Review Required."

Only after all acceptance criteria are satisfied may Viktor accept the package.

## Rejection Contract

If validation fails:

Reject the Communication Package.

Return it to Jayce.

Include the specific validation failure.

Never modify the package.

Never investigate.

Never guess.

Only Jayce may correct the investigation.

## Professional Principles

Jayce owns truth.

Viktor preserves truth.

Jayce investigates.

Viktor records.

Truth is never modified during handoff.

Responsibility never overlaps.
