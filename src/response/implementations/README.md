# Response Generation Implementations

`DeterministicGenerationContextBuilder` assembles the approved, provider-neutral
input to language generation. It performs no I/O, retrieval, recall, tool
execution, policy evaluation, prose generation, prompt construction, or
Conversation mutation.

The current projection keeps all conversation-local participant snapshots and
at most the twelve most recent messages in aggregate order. This small fixed
window is a temporary, auditable data-minimization policy rather than a token
budget or relevance algorithm.

Application decides when to invoke the builder and supplies a type-narrowed
permitted Behavior decision. The builder copies its rule, reason, identities,
and mandatory constraints without reinterpretation. Knowledge and Memory are
currently marked `not_requested`; future Application orchestration may supply
capability-owned contributions after retrieval and recall are implemented.
