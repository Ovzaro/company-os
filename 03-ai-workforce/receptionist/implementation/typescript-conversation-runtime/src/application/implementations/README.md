# Application Implementations

## Purpose

This directory contains the concrete orchestration that fulfills contracts
defined by the Application layer. An implementation coordinates domain values
and inward-facing ports to perform an application use case. It does not redefine
the contract or own the mechanics behind a port.

## Relationship to Application Contracts

Application contracts remain in the parent `application/` directory. They
describe the callable use-case surface, inputs, outputs, failure expectations,
and ownership boundaries. Implementations import and fulfill those contracts.
Contracts must never import this directory or otherwise depend on an
implementation.

## Relationship to Ports

Implementations may depend on interfaces from `ports/` when orchestration needs
a capability or platform service. They receive those dependencies explicitly
and invoke them through repository-owned abstractions. Implementations must
never import Infrastructure or select a concrete adapter.

## Relationship to Composition

Composition imports application implementations, constructs their port
dependencies, and assembles them into a `ReceptionistApplication`. Application
implementations do not import Composition, discover dependencies at runtime, or
control adapter lifetimes.

## Behavior-Gated Response Generation

`createEvaluateAction` is the first executable cross-capability orchestration.
Application owns this sequencing because deciding when capabilities run is a
use-case responsibility:

1. Behavior evaluates the proposed action and remains the sole owner of the
   policy decision.
2. Prohibited and escalation-required decisions are returned as typed outcomes;
   they do not invoke Response Generation or mutate Conversation.
3. Only a permitted decision triggers deterministic Knowledge retrieval.
4. Retrieved Knowledge Units are passed to the Response-owned deterministic context
   builder together with Conversation and the caller's typed intent.
5. Response Generation receives the resulting approved context and produces
   language.
6. The permitted result retains the complete Behavior decision alongside the
   generated response.

Policy outcomes are values rather than exceptions because they are expected,
meaningful results of evaluation. Exceptions remain available for operational
failures. Response Generation owns language only; it neither decides policy nor
orchestrates the request path.

`createProcessConversationTurn` extends that gated evaluation into the first
complete runtime. A permitted result is the only path that appends the incoming
messages as a Conversation `Turn` and saves the updated aggregate through
`ConversationStore`. Persistence follows successful generation, preventing a
generation failure from recording partial conversational progress.

Response Generation still owns language only and never mutates Conversation.
Prohibited and escalation-required decisions remain values and perform no
Knowledge retrieval, mutation, or persistence. Memory and Tool execution remain
future Application orchestration points.

## Why Implementations Are Separated

Keeping contracts and implementations in separate directories makes the stable
application boundary distinct from its current orchestration. Callers can
depend on contracts without acquiring construction details, and orchestration
can evolve without obscuring the use-case surface or reversing dependency
direction.

## Dependency Direction

```text
Composition ---> Application implementations ---> Application contracts
                            |
                            +---------------------> Ports

Infrastructure ----------------------------------> Ports
```

Dependencies point inward. Application contracts and Ports do not depend on
application implementations. Application implementations do not depend on
Composition or Infrastructure.

## Rules for Future Implementations

- Fulfill an existing Application contract without weakening its invariants.
- Keep use-case orchestration here; keep capability mechanics behind Ports.
- Receive every dependency explicitly through a factory or constructor.
- Depend only on domain types, Application contracts, and inward-facing Ports.
- Never import Infrastructure, Composition, providers, transports, or channels.
- Never introduce a service locator, dependency injection framework, ambient
  configuration, or hidden global dependency.
- Do not redefine capability-owned request or result types for wiring
  convenience.
- Preserve operational failures and outcomes in the vocabulary of the relevant
  contract and port.
