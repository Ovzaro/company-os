import type {
  Conversation,
  ConversationId,
  Timestamp,
} from "../conversation/index.js";

/**
 * Purpose:
 * Coordinate closing an active bounded interaction.
 *
 * Inputs:
 * - The identity of the conversation to close.
 * - The UTC instant at which it closes.
 *
 * Output:
 * - The resulting closed Conversation aggregate.
 *
 * Dependencies:
 * - Future conversation persistence and domain-operation ports.
 *
 * Failure cases:
 * - The conversation does not exist or cannot be loaded.
 * - The conversation is already closed.
 * - The closing instant violates a Conversation invariant.
 * - The closed aggregate cannot be persisted.
 *
 * Invariants:
 * - The returned conversation is closed and has a closing timestamp.
 * - Existing aggregate state is not mutated.
 * - Closing does not alter or delete durable memory.
 * - Only domain-valid aggregate state is persisted.
 *
 * Ownership:
 * Owns orchestration of closing and recording the interaction.
 *
 * Explicitly does not own:
 * Closure rules, retention, memory lifecycle, persistence mechanics, channel
 * teardown, delivery, serialization, or provider lifecycle.
 */
export type EndConversation = (
  conversationId: ConversationId,
  closedAt: Timestamp,
) => Promise<Conversation>;
