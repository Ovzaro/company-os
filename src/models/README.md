# Models

## Why this directory exists

`models/` contains stable core domain concepts shared across multiple capabilities.

## What belongs here

Domain entities, value objects, invariants, and identifiers with clear business meaning and multiple legitimate consumers belong here.

## What does not belong here

API DTOs, database records, provider payloads, channel events, anemic catch-all interfaces, and types owned by one capability do not belong here.
