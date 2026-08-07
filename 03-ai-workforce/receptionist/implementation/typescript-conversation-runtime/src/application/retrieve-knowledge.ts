/**
 * Purpose:
 * Coordinate a request for evidence relevant to an application workflow.
 *
 * Inputs:
 * - A Knowledge-owned retrieval request represented by `KnowledgeRequest`.
 *
 * Output:
 * - A Knowledge-owned retrieval result represented by `KnowledgeResult`.
 *
 * Dependencies:
 * - A future Knowledge retrieval port.
 *
 * Failure cases:
 * - The request is invalid according to the Knowledge capability.
 * - Retrieval is unavailable, fails, or cannot produce a trustworthy result.
 *
 * Invariants:
 * - The request is not mutated.
 * - Evidence and provenance semantics remain owned by Knowledge.
 * - Absence of relevant knowledge is not converted into invented knowledge.
 *
 * Ownership:
 * Owns orchestration of one knowledge-retrieval request.
 *
 * Explicitly does not own:
 * Knowledge content, indexing, search strategy, storage, provenance rules,
 * prompts, generation, providers, persistence implementations, or transport.
 *
 * The generic types are placeholders for future Knowledge-owned contracts;
 * they are not application DTOs.
 */
export type RetrieveKnowledge<KnowledgeRequest, KnowledgeResult> = (
  request: KnowledgeRequest,
) => Promise<KnowledgeResult>;
