/**
 * Purpose:
 * Coordinate recall of durable context relevant to an application workflow.
 *
 * Inputs:
 * - A Memory-owned recall request represented by `MemoryRequest`.
 *
 * Output:
 * - A Memory-owned recall result represented by `MemoryResult`.
 *
 * Dependencies:
 * - A future Memory recall port.
 *
 * Failure cases:
 * - The request is invalid according to the Memory capability.
 * - Recall is unavailable, fails, or is not authorized.
 *
 * Invariants:
 * - The request and recalled memory are not mutated.
 * - Memory retention, access, and relevance rules remain authoritative.
 * - Conversation state is not treated as durable memory by implication.
 *
 * Ownership:
 * Owns orchestration of one memory-recall request.
 *
 * Explicitly does not own:
 * Memory content, retention, authorization policy, ranking, storage, knowledge,
 * conversation state, response generation, providers, or transport.
 *
 * The generic types are placeholders for future Memory-owned contracts; they
 * are not application DTOs.
 */
export type RecallMemory<MemoryRequest, MemoryResult> = (
  request: MemoryRequest,
) => Promise<MemoryResult>;
