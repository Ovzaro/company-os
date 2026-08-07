# Receptionist

The Receptionist is an AI employee in the Company OS AI Workforce. It owns the quality of the first
interaction, answers from approved knowledge, collects relevant context, and routes or escalates each
legitimate inquiry to the correct destination.

## Employee definition

- `AGENTS.md` defines responsibilities, authority, and operating boundaries.
- `IDENTITY.md` defines the employee's organizational role and mission.
- `SOUL.md` defines voice, temperament, and interaction style.
- `knowledge/` contains approved Receptionist-specific operating knowledge.

## Documentation

`docs/` preserves historical plans, status records, and naming research from the earlier Receptionist
prototype.

## Implementation

`implementation/legacy-js/` contains the existing JavaScript prototype and its package-specific
files. It is retained intact for historical and engineering continuity.

The permanent TypeScript implementation will be imported later into `implementation/` through a
separate history-preserving Git migration. That repository has not been imported during Phase 1.
