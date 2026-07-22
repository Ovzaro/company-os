# Conversation Domain Model

## Purpose

The conversation domain describes the temporary, ordered interaction between humans and digital employees. It provides shared language for application workflows while remaining independent of APIs, channels, providers, behavior engines, memory, and persistence.

The model is an immutable aggregate:

```text
Conversation
├── Participant (one or more snapshots)
└── Turn (ordered)
    └── Message (one or more, ordered)
        └── authorId -> Participant
```

All properties are readonly. Collections use readonly arrays, and collections that must contain an item use `NonEmptyReadonlyArray`. Identifiers are branded strings to prevent identifiers for different concepts from being interchanged accidentally. Timestamps are serialized UTC instants rather than mutable `Date` objects.

These types state the valid shape of domain state. Any future operation that creates or changes an aggregate must enforce the documented semantic invariants before returning a new value; it must never mutate an existing value.

## Conversation

### Responsibility

`Conversation` is the aggregate root for one bounded interaction. It establishes the lifecycle boundary and the authoritative ordering of conversational state.

### Invariants

- A conversation has a non-empty identifier and at least one participant.
- Participant identifiers are unique within the conversation.
- Turns are ordered with contiguous sequence numbers beginning at 1.
- Turn and message identifiers are unique within the conversation.
- Every message author is a participant in the conversation.
- An active conversation has no closing timestamp; a closed conversation has one.
- Messages occur within the conversation's start and close times.

### Ownership

The conversation owns its lifecycle, its conversation-local participant snapshots, and its ordered turns. Because turns own messages, the conversation is the consistency boundary for all messages in the interaction.

It explicitly does not own memory, source identity records, behavior policy, provider execution, channel transport, knowledge, persistence, delivery state, or application orchestration. Deleting a conversation therefore says nothing about durable organizational memory.

## Participant

### Responsibility

`Participant` identifies an actor in the scope of one conversation. Its kind distinguishes a human from a digital employee without describing where the actor connected or how the actor should behave.

### Invariants

- Its identifier is non-empty and unique within the containing conversation.
- Its optional display name is non-empty when supplied.
- Its kind remains stable during the conversation.

### Ownership

A participant owns only its conversation-local identity, kind, and optional display label.

It explicitly does not own authentication, authorization, organization identity, channel identity, behavior, messages, memory, or durable profile data. It is a snapshot inside the aggregate, not the system of record for a person or employee.

## Message

### Responsibility

`Message` records one immutable textual statement by a participant. It is intentionally a domain statement rather than an API request, channel event, or provider message.

### Invariants

- Its identifier is non-empty and unique within the conversation.
- Its author refers to a participant in the containing conversation.
- Its content contains non-whitespace text.
- Its creation time is a valid UTC ISO 8601 timestamp.

### Ownership

A message owns its identity, author reference, textual content, and creation time.

It explicitly does not own its participant, turn, or conversation. It also does not own delivery receipts, provider roles or token usage, channel payloads, tool calls, attachments, memory, or persistence metadata. Those concepts can be modeled at their proper boundaries if and when the product requires them.

## Turn

### Responsibility

`Turn` groups one or more ordered messages into a coherent unit of conversational progress. A turn is not defined as one user request followed by one AI response: that assumption would prevent human handoff, multiple consecutive messages, and other valid conversational patterns.

### Invariants

- Its identifier is non-empty and unique within the conversation.
- Its sequence is a positive integer and contiguous within the conversation.
- It contains at least one message.
- Its messages are ordered from earliest to latest.
- Its message identifiers are unique within the conversation.

### Ownership

A turn owns its ordered messages and its position in the conversation.

It explicitly does not own participants, conversation lifecycle, behavior decisions, generation calls, channel delivery, memory, or persistence transactions.

## Boundary independence

Conversation and Memory remain separate bounded contexts. None of these types imports, references, embeds, or controls memory. An application workflow may later coordinate the two through separate contracts, but neither domain owns the other.

Behavior is also separate. A digital employee's policy may influence an application decision, but no behavior contract depends on a provider, and no behavior or provider concept appears in these domain models.

Channels translate external events at the edge. The domain contains no channel names, transport identifiers, delivery conventions, or vendor payloads. The same aggregate can therefore represent an interaction regardless of its transport.
