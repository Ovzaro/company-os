import type { Conversation } from "../conversation/index.js";

/**
 * Purpose:
 * Coordinate response generation for the current conversation context.
 *
 * Inputs:
 * - A domain-valid Conversation.
 * - Capability-owned behavior, knowledge, and memory context represented by
 *   `GenerationContext`.
 *
 * Output:
 * - A capability-owned generation result represented by `GeneratedResponse`.
 *
 * Dependencies:
 * - Future Behavior and Response Generation ports.
 * - Knowledge and Memory outputs when supplied by the calling workflow.
 *
 * Failure cases:
 * - Required context is unavailable or rejected by its owning capability.
 * - Behavior does not authorize a response.
 * - Response generation fails or returns an invalid capability result.
 *
 * Invariants:
 * - The Conversation and supplied context are not mutated.
 * - Behavior constraints remain authoritative over generation.
 * - A generated result is not silently treated as persisted or delivered.
 *
 * Ownership:
 * Owns coordination of the information needed to request a response.
 *
 * Explicitly does not own:
 * Behavior policy, prompts, models, provider selection, knowledge retrieval,
 * memory recall, domain message creation, persistence, transport, or delivery.
 *
 * The generic types are placeholders for future capability-owned contracts;
 * they are not application DTOs.
 */
export type GenerateResponse<GenerationContext, GeneratedResponse> = (
  conversation: Conversation,
  context: GenerationContext,
) => Promise<GeneratedResponse>;
