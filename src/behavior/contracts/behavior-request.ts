import type { ProposedAction } from "./proposed-action.js";

export type EmployeeId = string & { readonly __brand: "EmployeeId" };

export type PolicyScopeId = string & { readonly __brand: "PolicyScopeId" };

export type ExternalSideEffectRequirement = "none" | "required" | "ambiguous";

export type PriorAuthorization = "present" | "absent" | "ambiguous";

export type SupportedScope = "supported" | "unsupported" | "ambiguous";

export type EscalationRequirement = "not_required" | "required" | "ambiguous";

/**
 * The minimum evaluated policy context required by the deterministic engine.
 *
 * Every field is explicit so omitted or loosely structured metadata can never
 * become an accidental authorization default.
 */
export interface BehaviorRequest {
  readonly employeeId: EmployeeId;
  readonly policyScopeId: PolicyScopeId;
  readonly proposedAction: ProposedAction;
  readonly externalSideEffects: ExternalSideEffectRequirement;
  readonly priorAuthorization: PriorAuthorization;
  readonly supportedScope: SupportedScope;
  readonly escalation: EscalationRequirement;
}
