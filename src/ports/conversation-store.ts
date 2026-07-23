import type { Conversation, ConversationId } from "../conversation/index.js";

/**
 * Purpose:
 * Persist and retrieve bounded Conversation aggregates through an
 * implementation-neutral boundary.
 *
 * Ownership and capability mapping:
 * Owned exclusively by Conversation. This port maps only to the Conversation
 * capability and does not provide durable Memory or Knowledge storage.
 *
 * Responsibilities:
 * Retrieve a Conversation by its domain identity and persist a complete,
 * domain-valid Conversation aggregate.
 *
 * Inputs:
 * `load` receives a Conversation-owned identifier. `save` receives a complete
 * Conversation aggregate that Application has already coordinated and
 * validated.
 *
 * Outputs:
 * `load` resolves to the matching Conversation or `undefined` when none exists.
 * `save` resolves only after the aggregate has been accepted for persistence.
 *
 * Failure expectations:
 * Operational inability to load or save rejects the returned promise. Absence
 * is represented by `undefined`, not by an invented aggregate. Implementations
 * must not disguise partial, conflicting, or failed persistence as success.
 *
 * Invariants:
 * Returned aggregates satisfy Conversation invariants. Inputs are not mutated.
 * Saving does not weaken lifecycle, ordering, participant, or message rules.
 *
 * Explicit exclusions:
 * Durable memory, knowledge, behavior policy, generation, tool execution,
 * serialization, transactions across capabilities, provider concerns, and
 * storage technology are excluded.
 *
 * Dependency direction:
 * Application depends on this interface; Infrastructure implements it. This
 * interface depends only on Conversation-owned domain types and never on
 * Infrastructure.
 */
export interface ConversationStore {
  load(conversationId: ConversationId): Promise<Conversation | undefined>;
  save(conversation: Conversation): Promise<void>;
}
