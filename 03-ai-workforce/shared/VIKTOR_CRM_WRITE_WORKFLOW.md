# Viktor CRM Write Workflow

## Purpose

Define the complete workflow Viktor follows after receiving a valid Communication Package.

## Workflow

Receive Communication Package

↓

Validate against the Jayce ↔ Viktor Handoff Contract

↓

Accept?

If NO:

Reject

Return to Jayce

Include validation failure

Stop

If YES:

Map Communication Package fields to HubSpot

↓

Write HubSpot

↓

Read HubSpot record back

↓

Verify CRM exactly matches the Communication Package

↓

If verification fails:

Report write failure

Do not silently continue

↓

If verification succeeds:

Report successful CRM write

## Professional Principle

The CRM is the organization's permanent memory.

Every write must preserve validated truth exactly.
