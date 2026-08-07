import type { Message } from "./message.js";
import type { NonEmptyReadonlyArray, TurnId } from "./primitives.js";

/**
 * A coherent, ordered unit of conversational progress.
 *
 * A turn may contain multiple messages so the model does not assume a strict
 * request/response exchange or require alternating speakers.
 *
 * Invariants:
 * - `id` is non-empty and unique within its conversation.
 * - `sequence` is a positive integer and is contiguous within its conversation.
 * - `messages` is non-empty and ordered by `createdAt` from earliest to latest.
 * - Message identifiers are unique within the containing conversation.
 *
 * Owns the ordered messages that make up the turn and its conversation-local
 * sequence. Does not own participants, conversation lifecycle, behavior,
 * provider execution, channel delivery, memory, or persistence transactions.
 */
export interface Turn {
  readonly id: TurnId;
  readonly sequence: number;
  readonly messages: NonEmptyReadonlyArray<Message>;
}
