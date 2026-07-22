Decision #001

Conversation and Memory are separate bounded contexts.

Reason:

Conversation represents temporary interaction.

Memory represents durable organizational knowledge.

Consequences:

- Conversations may be deleted independently.
- Memory may outlive conversations.
- Neither subsystem owns the other.

Decision #002

Conversation is the aggregate root for temporary interaction state.

Reason:

Participants, turns, and messages must obey consistency rules within one bounded interaction.

Consequences:

- Conversation owns participant snapshots and ordered turns.
- Turns own their ordered messages.
- Conversation is the boundary for identity, authorship, ordering, and lifecycle invariants.

Decision #003

Turns represent coherent progress rather than fixed request-response pairs.

Reason:

Real conversations may contain consecutive messages, multiple participants, and human handoffs.

Consequences:

- A turn contains one or more messages.
- The domain does not require alternating speakers.
- Provider request and response shapes cannot define a turn.

Decision #004

Participants are conversation-local identity snapshots.

Reason:

The conversation needs stable authorship without owning authentication, authorization, organizational identity, or durable profiles.

Consequences:

- Messages refer to participants by conversation-local identifier.
- Participant kind records only whether the actor is human or a digital employee.
- Channel identity and durable participant information remain outside the conversation domain.

Decision #005

Messages contain transport-neutral text only in the initial domain model.

Reason:

Text is the smallest meaningful conversational statement, while attachments, delivery state, tool calls, and provider metadata have requirements that are not yet established.

Consequences:

- Messages cannot contain channel or provider payloads.
- New content forms require an explicit domain decision rather than leaking adapter types inward.
- Delivery and execution metadata must be modeled outside Message.

Decision #006

Domain state is represented by immutable TypeScript contracts and branded primitives.

Reason:

Readonly state makes aggregate replacement explicit, branded identifiers prevent accidental identifier interchange, and serialized timestamps avoid mutable Date objects.

Consequences:

- Domain properties and collections are readonly.
- Required collections use a non-empty readonly array type.
- Future creation and transition operations must validate semantic invariants and return new aggregate values.

Decision #007

Conversation domain contracts contain no Memory, Behavior, Provider, Channel, API, or persistence concepts.

Reason:

The domain language must describe interaction independently of durable knowledge, employee policy, external execution, transport, and infrastructure.

Consequences:

- Conversation and Memory remain independent bounded contexts.
- Behavior can evolve without provider dependencies.
- Adapters and application workflows translate at boundaries instead of shaping the domain.
