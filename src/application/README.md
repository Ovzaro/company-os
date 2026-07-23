# Application Layer

## Responsibilities

The Application Layer defines the use cases that coordinate the receptionist's
work. It may sequence conversation lifecycle operations, behavior evaluation,
knowledge retrieval, memory recall, response generation, and persistence.

Application code decides **when** those capabilities participate in a use case.
It does not decide **how** any capability is implemented.

Contracts live in this directory and concrete orchestration lives in
`implementations/`. The layer contains no handlers, adapters, provider
integrations, or transport behavior.

## Relationship to the Domain

The Application Layer orchestrates the domain and uses domain-owned types at its
boundary where those types already exist. It does not redefine, mutate, or
weaken domain invariants.

The conversation aggregate remains responsible for its lifecycle, participants,
turn ordering, messages, and internal consistency. Application use cases are
responsible for coordinating work around that aggregate; they are not a second
domain model.

## Relationship to Ports

Future ports will expose capabilities owned by Conversation, Knowledge, Memory,
Behavior, Response Generation, and Persistence. Use-case implementations will
depend on those abstractions.

Some contracts in this directory are generic placeholders for capability-owned
request and result types that do not exist yet. The type parameters must
eventually be supplied by the capability that owns their meaning. They must not
be replaced with application-owned DTOs or vendor-shaped types.

Ports are dependencies of use-case implementations, not implementations
themselves. No port is defined in this directory during this sprint.

## Relationship to Infrastructure

Infrastructure will implement ports and will be connected to use cases at a
future composition root. The Application Layer does not import infrastructure,
select implementations, inspect storage technology, or know which external
system fulfills a capability.

Transport adapters may invoke application use cases, but transport concerns and
API contracts do not enter this layer.

## Dependency Direction

Dependencies point inward:

```text
transport or infrastructure adapter
              |
              v
      application use case
          |         |
          v         v
    domain types   capability-owned ports
```

The Application Layer may depend on the Domain and future port contracts.
Domain code does not depend on the Application Layer. Port implementations and
transport adapters depend on inward contracts; application code never depends
on those outward implementations.

## Behavior-Gated Orchestration

`EvaluateAction` establishes the request path:

```text
Application -> Behavior -> Response Generation
                              |
                              v
                         Conversation
```

Application owns the sequence because orchestration is a use-case concern.
Behavior exclusively owns the policy decision, and Response Generation owns
language production. Prohibited and escalation-required decisions are returned
as typed policy outcomes rather than thrown because they are expected results,
not operational failures. Only a permitted decision reaches Response
Generation, and Conversation is accepted as context but is not mutated or
persisted by this use case.

Future use cases may extend the sequence with Conversation persistence,
Knowledge, Memory, and Tools while preserving the same ownership boundaries.

## Complete Conversation-Turn Runtime

`ProcessConversationTurn` is the first complete turn runtime:

```text
Application
  -> EvaluateAction
    -> Behavior
    -> Response Generation (permitted only)
  -> Conversation update (permitted only)
  -> ConversationStore (permitted only)
  -> Return
```

Application owns this runtime because sequencing capabilities and deciding when
state becomes durable are use-case responsibilities. Behavior gates the entire
state-changing path: prohibited and escalation-required decisions return
immediately as typed values, without generation, mutation, or persistence.
These outcomes are normal policy results rather than exceptional operational
failures.

Application passes a `GenerationIntent`, not caller-assembled context. After
Behavior permits the action, the Response-owned `GenerationContextBuilder`
projects approved Conversation data and carries the permitted rule, reason,
identities, and mandatory constraints to the generator. Composition wires the
builder but never assembles context fields.

Response Generation produces language but never mutates Conversation. The
current response result is deliberately returned separately because the mock
generator supplies text, not the identity, author, and timestamp required for a
Conversation-owned `Message`. Application appends the domain-valid incoming
messages as a new `Turn` only after generation succeeds. It then persists the
complete updated aggregate through `ConversationStore`, so a generation failure
cannot leave a partially completed turn in storage.

The orchestration leaves explicit future insertion points without implementing
their capabilities:

```text
Behavior
  -> Knowledge
  -> Memory
  -> Response Generation
  -> Conversation update
  -> Tool execution
  -> ConversationStore
```

Future Knowledge and Memory outputs can enrich approved generation context;
future Tool execution can occur at its explicit post-update orchestration
point; and durable persistence adapters can replace the in-memory
`ConversationStore` without changing the use case.

## Example Future Orchestration Flow

A future implementation of `ContinueConversation` could:

1. Ask a persistence port for the conversation.
2. coordinate domain validation of the incoming conversational progress;
3. ask a memory port to recall relevant durable context;
4. ask a knowledge port for relevant evidence;
5. ask a behavior port for the applicable constraints and decisions;
6. ask a response-generation port to produce a response;
7. coordinate domain validation of the resulting conversation state; and
8. ask a persistence port to save that state.

This is an architectural example, not prescribed runtime behavior. The use case
must preserve capability boundaries: conversation does not become memory,
generation does not become behavior, and persistence does not make domain
decisions.

## Explicit Exclusions

This layer owns no providers, HTTP concerns, framework integration, channel
logic, persistence implementation, serialization, DTOs, API contracts, business
entities, or composition-root configuration.
