# Architecture

## Purpose

Ovzaro Receptionist is a channel-agnostic conversational operating system. It coordinates the lifecycle of an interaction for any Ovzaro digital employee while keeping transports, vendors, persistence, and employee policy independently replaceable.

This document records architectural boundaries. It intentionally does not select frameworks, providers, databases, or messaging platforms.

## Architectural direction

Dependencies point inward toward Ovzaro-owned contracts and domain concepts. External systems are adapters at the edge.

```text
channel client -> channel adapter -> API/application contract -> use case
                                                         |-> behavior
                                                         |-> conversation
                                                         |-> memory contract
                                                         |-> knowledge contract
                                                         |-> tool contract
                                                         `-> provider contract
```

Application workflows may coordinate these capabilities, but one capability must not become an accidental gateway to another. In particular, conversations do not own memory, providers do not own knowledge retrieval, and prompts do not define behavior.

## Boundary rules

### Channels

Website, Telegram, Slack, Discord, customer websites, and future interfaces are clients of the same service. A channel adapter translates transport-specific events, identity, delivery semantics, and presentation constraints into shared contracts.

No channel-specific business logic may exist outside `src/channels/`. The application must not branch on channel names to decide employee policy.

### Providers

Providers implement replaceable external capabilities. Application and domain code depend on provider interfaces owned by this repository, never directly on a vendor SDK or vendor-shaped data type. Provider selection belongs at the composition boundary.

### Conversation and memory

A conversation is the bounded, ordered state of an interaction. Memory is durable information that may be recalled across interactions. They have separate models, lifecycles, retention policies, and ports. Application workflows can coordinate both through abstractions without either subsystem importing the other.

### Knowledge

Knowledge defines retrieval requests, evidence, provenance, and result semantics independently of generation providers and storage technology. A knowledge implementation may use search or storage adapters, but provider prompts must not be its public interface.

### Behavior

Behavior contains explicit policies, constraints, and decisions that describe how a digital employee acts. Prompts may render behavior decisions for a provider, but they are an adapter representation—not the source of truth.

### Abstractions

Interfaces and types live with the capability that owns their meaning. Consumers import capability contracts; implementations satisfy them. Shared types belong in `src/types/` only when no more specific owner exists.

## Composition

Concrete implementations will be assembled at a composition root when runtime functionality is introduced. Construction and configuration are the only places that should know both an abstraction and its implementation. This keeps tests simple and prevents vendor dependencies from spreading through the codebase.

## Cross-cutting concerns

- Configuration is validated at startup and passed explicitly.
- Telemetry observes operations without controlling domain decisions.
- Middleware handles genuinely cross-cutting processing, not hidden business workflows.
- API contracts are versioned independently from internal models.
- Errors crossing a boundary are translated into that boundary's vocabulary.
- Security, privacy, authorization, retention, and auditability are design inputs for every future adapter.

## Decision discipline

Material architectural choices should be documented before they become difficult to reverse. New dependencies require a clear boundary, an owner, and a replacement strategy. Convenience alone is not sufficient reason to couple two subsystems.
