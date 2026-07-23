import type {
  Conversation,
  NonEmptyReadonlyArray,
  Participant,
  Timestamp,
} from "../conversation/index.js";

/**
 * Purpose:
 * Begin one bounded interaction from domain-valid participant snapshots.
 *
 * Inputs:
 * - A non-empty collection of participants.
 * - The UTC instant at which the interaction begins.
 *
 * Output:
 * - The newly established, active Conversation aggregate.
 *
 * Dependencies:
 * - Future conversation identity and persistence ports.
 * - Domain operations that establish a valid Conversation.
 *
 * Failure cases:
 * - The participants or timestamp violate domain invariants.
 * - A conversation identity cannot be allocated.
 * - The conversation cannot be persisted.
 *
 * Invariants:
 * - The returned aggregate satisfies every Conversation invariant.
 * - The new conversation is active and has no turns or closing timestamp.
 * - No supplied participant snapshot is mutated.
 *
 * Ownership:
 * Owns orchestration of starting and recording the interaction.
 *
 * Explicitly does not own:
 * Participant source records, identity generation mechanics, domain rules,
 * storage, channels, serialization, behavior, memory, knowledge, or providers.
 */
export type StartConversation = (
  participants: NonEmptyReadonlyArray<Participant>,
  startedAt: Timestamp,
) => Promise<Conversation>;
