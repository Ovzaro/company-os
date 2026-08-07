---
id: repository-readme
title: Ovzaro Knowledge Base
owner: TODO
status: Draft
version: 1.0
last_updated: 2026-07-24
audience: Ovzaro Digital Employees and knowledge contributors
tags:
  - knowledge-base
  - governance
---

# Ovzaro Knowledge Base

## Purpose

This repository is the canonical source of company knowledge used by Ovzaro Digital Employees. It contains internal operational knowledge, not application code, prompts, or provider-specific instructions.

## Repository Philosophy

- Knowledge owns facts.
- Documents should be clear, concise, and usable in day-to-day operations.
- Unknown information is marked `TODO`.
- Contributors must not infer or fabricate business facts.
- Each fact should have one authoritative home and may be referenced elsewhere.

## Relationship to `ovzaro-receptionist`

`ovzaro-receptionist` is a consumer of approved knowledge in this repository. Receptionist implementation, prompts, integrations, and runtime behavior belong outside this repository.

## Relationship to Future Digital Employees

Future Digital Employees should retrieve shared company facts from this repository. Employee-specific operating knowledge belongs under `employees/`, while reusable company facts belong in the relevant shared directory.

## Versioning Philosophy

Each document has a `version` field.

- Use `1.0` for the initial document.
- Increment the version when approved knowledge changes.
- Record the date of the latest content change in `last_updated`.
- Use repository history to inspect earlier revisions.

TODO: Define the version increment policy for minor and major changes.

## Knowledge Ownership

Every document has an `owner`. The owner is accountable for accuracy, review, and timely updates. Until an owner is assigned, use `TODO`.

## Updating Documents

1. Edit the authoritative document for the fact.
2. Replace unknown content with verified information only.
3. Update `last_updated`.
4. Update `version` according to the approved versioning policy.
5. Keep `status: Draft` until approval is recorded.
6. Check related documents for contradictions or stale references.

## Approval

Draft content is not approved operational knowledge. A designated approver must review changes for accuracy and consistency before the status changes.

TODO: Define approval roles, approved status values, and the approval record.

## Directory Overview

- `company/`: Company identity, direction, principles, constitution, and terminology.
- `products/`: Reserved for verified product knowledge. TODO: Define its initial structure.
- `services/`: Service delivery, onboarding, implementation, pricing, and FAQs.
- `sales/`: Sales discovery, qualification, objections, and process.
- `policies/`: Internal operational policies.
- `clients/`: Client knowledge governance and future client records.
- `employees/`: Role-specific knowledge for Digital Employees.
- `marketing/`: Positioning, messaging, and brand voice.
- `templates/`: Reusable knowledge-document templates.

