# Memory

## Purpose

Memory is the inward capability for durable remembered context that may remain
useful across interactions. It gives remembered information an explicit
lifecycle without turning Conversation into a durable profile or archive.

## Responsibilities

Memory owns:

- the meaning and structure of durable remembered context;
- retention, expiration, correction, deletion, consent, and scope semantics;
- decisions about whether information is eligible to be remembered;
- recall relevance and the semantics used to select useful memories;
- memory lifecycle state and rules; and
- the capability vocabulary for recording, recalling, and forgetting memory.

## Inputs

Conceptual inputs include candidate remembered information, its subject and
organizational scope, provenance needed to understand how it was learned,
retention or consent constraints, lifecycle commands, and a recall need with
relevance context. These are capability concepts, not provider payloads,
database rows, or complete Conversation aggregates.

## Outputs

Conceptual outputs include accepted or rejected memory candidates, relevant
memory results, lifecycle outcomes, and enough provenance and status information
for the Application Layer to use them responsibly. A recall result is context,
not a new fact merely because it was previously remembered.

## Ownership

Memory exclusively owns durable remembered context, recall relevance, retention
semantics, and the memory lifecycle. Other capabilities may supply candidates or
consume recalled context, but they do not redefine what a memory means or how
long it remains valid.

## Explicit exclusions

Memory does not own:

- live or ordered conversation state;
- conversation transcripts as an interaction aggregate;
- source-of-truth business knowledge;
- evidence retrieval or knowledge ranking;
- behavior policy or authorization;
- response generation;
- application orchestration;
- persistence technology, indexes, embeddings, or database schemas; or
- channel, transport, or provider context-window state.

In particular, Memory must not become a second Conversation store.

## Dependencies

Memory may depend on its own future contracts and narrowly shared primitives
with no more specific owner. Its rules must remain independent of Conversation,
Knowledge, Behavior, Response Generation, Tools, providers, storage products,
and transports. Application workflows may coordinate Memory with those
capabilities without creating direct capability-to-capability dependencies.

## Future ports suggested by the boundary

This boundary suggests future inward ports for recalling relevant memory,
submitting or recording eligible memory, applying lifecycle changes such as
correction or forgetting, and enforcing retention. Their exact contracts are
deferred. Storage, indexing, and similar outward adapters would implement those
ports without defining Memory semantics.

## Invariants

- Memory is durable by intent and has an explicit subject and scope.
- Every memory has lifecycle and retention semantics.
- Recall is relevance-based and constrained to the requesting scope.
- A memory candidate is not durable memory until Memory accepts it.
- Correction, expiration, and deletion remain expressible lifecycle outcomes.
- Provenance and consent constraints are preserved when required.
- Recalled memory is never treated as verified source-of-truth knowledge solely
  because it was retained.
- Memory never stores a Conversation aggregate as its own model.

## Failure expectations

Memory failures are explicit and expressed in Memory vocabulary. Unavailable
storage, invalid scope, prohibited retention, missing consent, expired memory,
or no relevant recall must not be disguised as a successful recall. No result
is a valid outcome. Failure must not cause invented memories, silent
over-retention, or mutation of Conversation state.

## Relationship to Conversation

Conversation remains the aggregate for bounded, ordered interaction state.
Memory may receive an eligible candidate derived from an interaction and may
return durable context relevant to a later interaction, but it neither owns nor
reconstructs Conversation. Conversation deletion and memory lifecycle are
separate decisions governed by their respective rules.

## Relationship to the Application Layer

The Application Layer decides when a use case requests recall, submits a memory
candidate, or coordinates a lifecycle operation. It consumes future
Memory-owned contracts and combines their outcomes with other capability
results. It does not redefine retention, relevance, consent, or lifecycle
semantics.

## Relationship to Infrastructure

Infrastructure will implement future Memory ports using databases, vector
indexes, caches, encryption, or other technologies. Those adapters translate
between technology-specific representations and Memory-owned concepts.
Infrastructure may enforce a Memory decision but may not invent retention
policy, recall meaning, or eligibility rules.

## Examples of what belongs inside the capability

- A durable preference with subject, scope, provenance, and expiration.
- Rules for whether a candidate may be retained.
- Relevance semantics for recalling prior context.
- Correction, forgetting, and expiry outcomes.
- A distinction between active, expired, and deleted memory.

## Examples of what must remain outside the capability

- The current Conversation, its turns, and its messages.
- An employee handbook retrieved as authoritative evidence.
- A rule requiring human escalation.
- A generated reply or model prompt.
- A PostgreSQL repository, vector database client, or embedding SDK.
- The workflow deciding when recall and generation occur.
