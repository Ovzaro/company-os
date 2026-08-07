# API

## Status

No API routes or transport protocol are implemented in this bootstrap. This document defines the principles future APIs must follow.

## Principles

- The service API is channel-agnostic; channel payloads are translated by adapters.
- Public contracts are versioned and do not expose provider, database, or framework types.
- Requests carry explicit identity, tenant, correlation, and idempotency context where applicable.
- Streaming and asynchronous delivery are capabilities of a contract, not assumptions embedded in business logic.
- Errors use stable service-level codes and preserve safe diagnostic context.
- Authentication and authorization are enforced at boundaries and represented explicitly to application workflows.
- API changes remain backward compatible within a supported version or introduce a new version.

## Planned contract areas

Future design work may define contracts for interaction submission, response delivery, conversation lifecycle, feedback, health, and operational readiness. Their schemas and protocols will be selected only after core application contracts and lifecycle semantics are established.

Channel webhooks and platform-specific callbacks belong to channel adapters, not to the shared service contract.
