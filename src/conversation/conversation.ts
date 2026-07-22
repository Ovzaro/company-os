import type { Participant } from "./participant.js";
import type {
  ConversationId,
  NonEmptyReadonlyArray,
  Timestamp,
} from "./primitives.js";
import type { Turn } from "./turn.js";

/** The lifecycle state of a bounded interaction. */
export type ConversationStatus = "active" | "closed";

/**
 * The aggregate root for one bounded, temporary interaction.
 *
 * Invariants:
 * - `id` is non-empty.
 * - `participants` is non-empty and contains unique participant identifiers.
 * - `turns` is ordered, and turn sequences start at 1 and remain contiguous.
 * - Every message author refers to one of `participants`.
 * - Turn and message identifiers are unique across the conversation.
 * - `startedAt` and `closedAt`, when present, are valid UTC ISO 8601 timestamps.
 * - An active conversation has no `closedAt`; a closed conversation has one.
 * - No message predates `startedAt` or follows `closedAt`.
 *
 * Owns its lifecycle, participant snapshots, and ordered turns. Through turns,
 * it owns the messages belonging to this interaction.
 *
 * Does not own durable memory, participant source records, employee behavior,
 * provider execution, channel transport, delivery, persistence, knowledge, or
 * application workflow.
 */
export interface Conversation {
  readonly id: ConversationId;
  readonly status: ConversationStatus;
  readonly participants: NonEmptyReadonlyArray<Participant>;
  readonly turns: readonly Turn[];
  readonly startedAt: Timestamp;
  readonly closedAt?: Timestamp;
}
