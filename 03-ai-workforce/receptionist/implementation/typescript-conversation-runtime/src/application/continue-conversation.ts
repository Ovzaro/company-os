import type {
  Conversation,
  ConversationId,
  NonEmptyReadonlyArray,
  Message,
} from "../conversation/index.js";

/**
 * Purpose:
 * Coordinate the addition of conversational progress to an active interaction.
 *
 * Inputs:
 * - The identity of the conversation to continue.
 * - One or more domain-valid messages in conversational order.
 *
 * Output:
 * - The resulting Conversation aggregate after the progress is accepted.
 *
 * Dependencies:
 * - Future conversation persistence and domain-operation ports.
 * - Future Memory, Knowledge, Behavior, and Response Generation ports when the
 *   selected orchestration requires them.
 *
 * Failure cases:
 * - The conversation does not exist or cannot be loaded.
 * - The conversation is already closed.
 * - The proposed progress violates an aggregate invariant.
 * - A required capability fails or the resulting state cannot be persisted.
 *
 * Invariants:
 * - Existing aggregate state is not mutated.
 * - Turn sequences and message ordering remain valid and contiguous.
 * - Every message author is a participant in the conversation.
 * - Persistence occurs only for domain-valid aggregate state.
 *
 * Ownership:
 * Owns coordination of one request to advance an existing conversation.
 *
 * Explicitly does not own:
 * Conversation rules, message content, behavior policy, memory, knowledge,
 * generation mechanics, persistence mechanics, transport, or delivery.
 */
export type ContinueConversation = (
  conversationId: ConversationId,
  messages: NonEmptyReadonlyArray<Message>,
) => Promise<Conversation>;
