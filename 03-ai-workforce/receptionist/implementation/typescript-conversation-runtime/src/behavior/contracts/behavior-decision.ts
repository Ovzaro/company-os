import type {
  BehaviorConstraint,
  BehaviorReasonCode,
  BehaviorRuleId,
} from "./behavior-rule.js";
import type { EmployeeId, PolicyScopeId } from "./behavior-request.js";

interface DecisionAuditContext {
  readonly employeeId: EmployeeId;
  readonly policyScopeId: PolicyScopeId;
}

export type BehaviorDecision = DecisionAuditContext &
  (
    | {
        readonly outcome: "permitted";
        readonly ruleId: BehaviorRuleId;
        readonly reason: BehaviorReasonCode;
        readonly mandatoryConstraints: readonly BehaviorConstraint[];
      }
    | {
        readonly outcome: "prohibited";
        readonly ruleId: BehaviorRuleId;
        readonly reason: BehaviorReasonCode;
      }
    | {
        readonly outcome: "escalation_required";
        readonly ruleId: BehaviorRuleId;
        readonly reason: BehaviorReasonCode;
      }
  );
