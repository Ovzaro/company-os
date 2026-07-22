# API

## Why this directory exists

`api/` defines and adapts the service's channel-neutral external API boundary.

## What belongs here

Versioned request and response contracts, protocol adapters, validation at the service boundary, and service-level error translation belong here.

## What does not belong here

Business logic, channel webhook semantics, provider payloads, database models, and vendor-specific types do not belong here.
