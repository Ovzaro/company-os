/**
 * Purpose:
 * Provide the inward boundary for retrieving trustworthy, source-grounded
 * evidence.
 *
 * Ownership and capability mapping:
 * Owned exclusively by Knowledge. `KnowledgeRequest` and `KnowledgeResult` are
 * Knowledge-owned contracts, never prompt, vendor, storage, or transport types.
 *
 * Responsibilities:
 * Accept a Knowledge-defined information need and return Knowledge-defined
 * evidence, provenance, ranking, freshness, conflict, uncertainty, or absence.
 *
 * Inputs:
 * `retrieve` receives one Knowledge-owned retrieval request containing the
 * scope and constraints needed to judge relevant evidence.
 *
 * Outputs:
 * `retrieve` resolves to a Knowledge-owned retrieval result that preserves
 * evidence provenance and explicitly represents no evidence when applicable.
 *
 * Failure expectations:
 * Knowledge-defined absence, conflict, staleness, access restriction, and
 * partial results remain explicit in the result. Operational failure rejects
 * the promise and must never yield fabricated or unsupported evidence.
 *
 * Invariants:
 * Every evidence item preserves its source and provenance. Relevance does not
 * imply authority, limitations remain visible, and vendor result shapes never
 * cross this boundary.
 *
 * Explicit exclusions:
 * Durable memory, Conversation state, behavior policy, response composition,
 * prompt construction, application orchestration, and retrieval technology are
 * excluded.
 *
 * Dependency direction:
 * Application depends on this interface; Infrastructure implements it. The
 * interface never imports Infrastructure or another capability.
 */
export interface KnowledgeRetriever<KnowledgeRequest, KnowledgeResult> {
  retrieve(request: KnowledgeRequest): Promise<KnowledgeResult>;
}
