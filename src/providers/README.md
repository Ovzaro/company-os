# Providers

## Why this directory exists

`providers/` isolates replaceable external capability implementations behind repository-owned abstractions.

## What belongs here

Provider ports where this module owns the capability, adapter implementations, vendor data translation, resilience policies, and provider selection metadata belong here.

## What does not belong here

Vendor types leaking into application code, business behavior, knowledge ownership, channel handling, and assumptions that one provider is permanent do not belong here.
