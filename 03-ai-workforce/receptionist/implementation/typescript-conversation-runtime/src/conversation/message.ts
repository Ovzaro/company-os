import type { MessageId, ParticipantId, Timestamp } from "./primitives.js";

/**
 * One immutable statement authored by a participant during a conversation.
 *
 * Invariants:
 * - `id` is non-empty and unique within its conversation.
 * - `authorId` refers to a participant in the containing conversation.
 * - `content` contains non-whitespace text.
 * - `createdAt` is a valid UTC ISO 8601 timestamp.
 *
 * Owns its identity, author reference, textual content, and creation time.
 * Does not own its author, turn, conversation, delivery state, provider data,
 * channel payloads, tool calls, attachments, or persistence metadata.
 */
export interface Message {
  readonly id: MessageId;
  readonly authorId: ParticipantId;
  readonly content: string;
  readonly createdAt: Timestamp;
}
