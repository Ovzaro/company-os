/**
 * Purpose:
 * Provide the inward boundary for controlled execution of a specific,
 * previously approved external action.
 *
 * Ownership and capability mapping:
 * Owned exclusively by Tools. `ExecutionRequest` and `ExecutionResult` are
 * Tools-owned contracts; authorization remains owned by Behavior and is merely
 * supplied as approved execution context.
 *
 * Responsibilities:
 * Validate execution inputs, invoke the approved action, and report normalized
 * execution status, side effects, external references, and audit facts.
 *
 * Inputs:
 * `execute` receives a Tools-owned request for a specific approved action with
 * validated parameters, execution scope, and correlation or idempotency
 * context.
 *
 * Outputs:
 * `execute` resolves to a Tools-owned result that distinguishes success,
 * rejection, partial effect, indeterminate outcome, and normalized failure.
 *
 * Failure expectations:
 * Invalid input, unavailable systems, expired grants, timeouts, partial effects,
 * and indeterminate outcomes remain explicit. Operational failure rejects the
 * promise and must not trigger an unauthorized fallback or be reported as
 * success.
 *
 * Invariants:
 * Every execution has prior approval, inputs are validated before side effects,
 * authority cannot be broadened, and retries honor explicit idempotency
 * semantics.
 *
 * Explicit exclusions:
 * Authorization decisions, behavior policy, Conversation mutation, response
 * generation, application retry or escalation orchestration, credentials,
 * vendor SDKs, transport, and provider-specific calls are excluded.
 *
 * Dependency direction:
 * Application depends on this interface; Infrastructure implements it. The
 * interface never imports Infrastructure, Behavior, or another capability.
 */
export interface ToolExecutor<ExecutionRequest, ExecutionResult> {
  execute(request: ExecutionRequest): Promise<ExecutionResult>;
}
