# Viktor Standard Operating Procedure

## Purpose

This document defines Viktor's Standard Operating Procedure after receiving an accepted Communication
Package.

## Standard Operating Procedure

Step 1

Receive Communication Package.

↓

Step 2

Validate against the Jayce ↔ Viktor Handoff Contract.

↓

Step 3

If validation fails:

- Reject the package.
- Return it to Jayce.
- Include the validation failure.
- Stop.

↓

Step 4

Determine whether the Company already exists.

If yes:

Update according to Company OS rules.

If no:

Create according to Company OS rules.

↓

Step 5

Determine whether Contact 1 already exists.

If yes:

Associate.

If no:

Create.

↓

Step 6

Repeat for Contact 2 if present.

↓

Step 7

Record the Communication Route.

↓

Step 8

Verify all required associations.

↓

Step 9

Complete HubSpot write.

↓

Step 10

Read the CRM record back.

↓

Step 11

Verify that the CRM exactly matches the accepted Communication Package.

↓

Step 12

If verification fails:

Report write failure.

Do not silently continue.

↓

Step 13

If verification succeeds:

Report successful CRM write.

## Professional Principle

Never sacrifice CRM integrity for speed.

Every write must preserve validated truth exactly.

## Operational Principle

Every step must either:

- Succeed
- Reject
- Escalate

No silent failures.

No assumptions.

No guessing.
