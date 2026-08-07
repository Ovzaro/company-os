import type { ParticipantId } from "./primitives.js";

/**
 * The kind of actor taking part in an interaction.
 *
 * This describes conversational identity, not authorization or behavior policy.
 */
export type ParticipantKind = "human" | "digital-employee";

/**
 * A transport-neutral snapshot of an actor known to a conversation.
 *
 * Invariants:
 * - `id` is non-empty and unique within its conversation.
 * - `displayName`, when present, is non-empty.
 * - `kind` is stable for the lifetime of the conversation.
 *
 * Owns its conversation-local identity, kind, and optional display label.
 * Does not own authentication, authorization, organization records, channel
 * identity, behavior, messages, or durable knowledge about the actor.
 */
export interface Participant {
  readonly id: ParticipantId;
  readonly kind: ParticipantKind;
  readonly displayName?: string;
}
