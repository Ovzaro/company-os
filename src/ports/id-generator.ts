/**
 * Purpose:
 * Provide an owner-neutral boundary for allocating a new identifier.
 *
 * Ownership and capability mapping:
 * This is a shared platform service with no capability owner. `Identifier` is
 * supplied by the consuming capability, which retains ownership of its meaning
 * and validation rules.
 *
 * Responsibilities:
 * Allocate an identifier without defining the entity, aggregate, storage, or
 * capability semantics attached to it.
 *
 * Inputs:
 * `generate` accepts no input; namespaces, vendor configuration, and ambient
 * runtime state are not exposed through this contract.
 *
 * Outputs:
 * `generate` resolves to the consumer-supplied `Identifier` contract.
 *
 * Failure expectations:
 * Inability to allocate a valid identifier rejects the promise. The service
 * must not return an invalid, empty, known-duplicate, or silently reused value.
 *
 * Invariants:
 * Returned identifiers satisfy the consuming capability's identifier
 * invariants. Allocation does not mutate capability state or imply persistence.
 *
 * Explicit exclusions:
 * Entity creation, persistence, identity or authentication, correlation policy,
 * serialization, provider selection, time observation, and runtime wiring are
 * excluded.
 *
 * Dependency direction:
 * Application or an inward capability may depend on this interface;
 * Infrastructure implements it. The interface never depends on Infrastructure
 * or any capability-owned type.
 */
export interface IdGenerator<Identifier> {
  generate(): Promise<Identifier>;
}
