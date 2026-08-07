/**
 * Purpose:
 * Provide an owner-neutral boundary for observing the current time.
 *
 * Ownership and capability mapping:
 * This is a shared platform service with no capability owner. `Instant` is
 * supplied by the consuming capability, which retains ownership of its meaning.
 *
 * Responsibilities:
 * Return one representation of the current instant without defining calendar,
 * lifecycle, retention, or Conversation semantics.
 *
 * Inputs:
 * `now` accepts no input; ambient provider configuration is not part of the
 * contract.
 *
 * Outputs:
 * `now` resolves to the consumer-supplied `Instant` contract.
 *
 * Failure expectations:
 * Inability to observe time rejects the promise. The service must not fabricate
 * an instant, silently fall back to a stale value, or conceal invalid output.
 *
 * Invariants:
 * One call represents one observation. The returned value satisfies the
 * consuming capability's instant invariants and no input state is mutated.
 *
 * Explicit exclusions:
 * Scheduling, delays, timers, time-zone policy, lifecycle decisions, retention
 * policy, identifier generation, provider selection, and runtime wiring are
 * excluded.
 *
 * Dependency direction:
 * Application or an inward capability may depend on this interface;
 * Infrastructure implements it. The interface never depends on Infrastructure
 * or any capability-owned type.
 */
export interface Clock<Instant> {
  now(): Promise<Instant>;
}
