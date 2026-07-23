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

Decision #008

Behavior evaluation is deterministic, explicit, and fail-closed.

Reason:

Employee authority must be reviewable and reproducible before response generation or tool execution, and authority must never be inferred from ambiguity, prompts, provider output, or Tool availability.

Consequences:

- Behavior returns typed permission, prohibition, or escalation decisions with stable rule and reason identifiers.
- Explicit escalation and unsupported scope take precedence over permission.
- Ambiguous authority or policy context cannot produce permission.
- Side-effecting actions and tool execution require explicit prior authorization.
- Policy outcomes are returned as data; exceptions are reserved for operational or programming failures.
- Application owns orchestration, while Composition selects the implementation without making policy decisions.

Decision #009

Generation context is repository-owned, provider-neutral, behavior-constrained,
and assembled only after permission.

Reason:

Response Generation needs one deliberate, auditable contract for approved
Conversation, Behavior, Knowledge, and Memory contributions without allowing
callers or providers to define prompts as the inward boundary.

Consequences:

- Application invokes context assembly only after Behavior permits an action.
- Callers supply a typed response intent rather than assembled context or
  authorization data.
- Behavior rule, reason, identities, and mandatory constraints reach Response
  Generation unchanged.
- Missing Knowledge and Memory contributions are explicit and cannot be
  fabricated by the builder or generator.
- Conversation is exposed through a bounded projection rather than the complete
  aggregate or unlimited history.
- Providers translate `GenerationContext` at the outer boundary and cannot
  redefine it.
