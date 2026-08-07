/**
 * Purpose:
 * Provide the inward boundary for evaluating how a digital employee is
 * permitted and expected to act.
 *
 * Ownership and capability mapping:
 * Owned exclusively by Behavior. `BehaviorRequest` and `BehaviorDecision` are
 * Behavior-owned contracts and do not transfer ownership of supplied context
 * from another capability.
 *
 * Responsibilities:
 * Evaluate applicable authority, policies, constraints, conduct, response
 * posture, prohibition, and escalation requirements.
 *
 * Inputs:
 * `evaluate` receives a Behavior-owned request describing the employee,
 * proposed action, relevant evaluated context, authority, and risk signals.
 *
 * Outputs:
 * `evaluate` resolves to a Behavior-owned decision containing explicit
 * permission, prohibition, constraints, escalation, reasons, or conflicts.
 *
 * Failure expectations:
 * Ambiguous authority, policy conflicts, and escalation remain explicit.
 * Operational failure rejects the promise. Implementations fail closed and
 * never convert uncertainty or unavailability into permission.
 *
 * Invariants:
 * Permission is intentional, prohibitions cannot be weakened downstream,
 * Behavior constraints remain independent of prompt wording, and Tools never
 * authorize themselves.
 *
 * Explicit exclusions:
 * Knowledge truth, Memory, Conversation persistence, prose generation, tool
 * execution, application orchestration, provider integration, and policy
 * storage technology are excluded.
 *
 * Dependency direction:
 * Application depends on this interface; Infrastructure implements it. The
 * interface never imports Infrastructure or invokes another capability.
 */
export interface BehaviorEngine<BehaviorRequest, BehaviorDecision> {
  evaluate(request: BehaviorRequest): Promise<BehaviorDecision>;
}
