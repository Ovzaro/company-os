/**
 * Purpose:
 * Provide the inward boundary for recalling and applying lifecycle operations
 * to durable remembered context.
 *
 * Ownership and capability mapping:
 * Owned exclusively by Memory. Every type parameter represents a Memory-owned
 * contract and must not be substituted with Conversation, Knowledge, transport,
 * provider, or persistence representations.
 *
 * Responsibilities:
 * Recall relevant memory, record eligible memory, and apply Memory-defined
 * lifecycle changes without exposing implementation mechanics.
 *
 * Inputs:
 * `recall`, `record`, and `applyLifecycle` receive their corresponding
 * Memory-owned request contracts.
 *
 * Outputs:
 * Each operation resolves to its corresponding Memory-owned result contract,
 * including explicit absence, rejection, or lifecycle outcomes where required
 * by Memory semantics.
 *
 * Failure expectations:
 * Memory-defined negative outcomes remain in result contracts. Operational
 * inability to perform an operation rejects the promise and must not invent
 * memory, silently retain prohibited data, or mutate Conversation state.
 *
 * Invariants:
 * Scope, subject, relevance, provenance, consent, retention, expiration,
 * correction, and deletion semantics remain authoritative. A Conversation
 * aggregate is never stored as a Memory model.
 *
 * Explicit exclusions:
 * Live conversation persistence, evidence retrieval, behavior policy, response
 * generation, application orchestration, provider types, and storage technology
 * are excluded.
 *
 * Dependency direction:
 * Application depends on this interface; Infrastructure implements it. The
 * interface never depends on Infrastructure or another capability.
 */
export interface MemoryStore<
  RecallRequest,
  RecallResult,
  RecordRequest,
  RecordResult,
  LifecycleRequest,
  LifecycleResult,
> {
  recall(request: RecallRequest): Promise<RecallResult>;
  record(request: RecordRequest): Promise<RecordResult>;
  applyLifecycle(request: LifecycleRequest): Promise<LifecycleResult>;
}
