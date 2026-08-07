import type {
  BehaviorConstraint,
  BehaviorDecision,
  BehaviorRequest,
} from "../contracts/index.js";
import {
  BEHAVIOR_REASON_CODES,
  BEHAVIOR_RULE_IDS,
} from "../contracts/index.js";
import type { BehaviorEngine } from "../../ports/behavior-engine.js";

const RESPONSE_CONSTRAINTS: readonly BehaviorConstraint[] = [
  "do_not_execute_tools",
  "do_not_create_external_side_effects",
];

/**
 * Evaluates policy in a fixed precedence order. It has no I/O, mutable state,
 * external dependencies, or downstream capability access.
 */
export class DeterministicBehaviorEngine implements BehaviorEngine<
  BehaviorRequest,
  BehaviorDecision
> {
  evaluate(request: BehaviorRequest): Promise<BehaviorDecision> {
    const auditContext = {
      employeeId: request.employeeId,
      policyScopeId: request.policyScopeId,
    };

    if (request.escalation === "required") {
      return Promise.resolve({
        ...auditContext,
        outcome: "escalation_required",
        ruleId: BEHAVIOR_RULE_IDS.EXPLICIT_ESCALATION,
        reason: BEHAVIOR_REASON_CODES.HUMAN_ESCALATION_REQUIRED,
      });
    }

    if (request.supportedScope === "unsupported") {
      return Promise.resolve({
        ...auditContext,
        outcome: "escalation_required",
        ruleId: BEHAVIOR_RULE_IDS.SUPPORTED_SCOPE,
        reason: BEHAVIOR_REASON_CODES.UNSUPPORTED_SCOPE,
      });
    }

    if (
      request.escalation === "ambiguous" ||
      request.supportedScope === "ambiguous" ||
      request.externalSideEffects === "ambiguous" ||
      request.priorAuthorization === "ambiguous"
    ) {
      return Promise.resolve({
        ...auditContext,
        outcome: "prohibited",
        ruleId: BEHAVIOR_RULE_IDS.UNAMBIGUOUS_POLICY_CONTEXT,
        reason: BEHAVIOR_REASON_CODES.AMBIGUOUS_POLICY_CONTEXT,
      });
    }

    if (
      request.externalSideEffects === "required" &&
      request.priorAuthorization !== "present"
    ) {
      return Promise.resolve({
        ...auditContext,
        outcome: "prohibited",
        ruleId: BEHAVIOR_RULE_IDS.SIDE_EFFECT_AUTHORIZATION,
        reason: BEHAVIOR_REASON_CODES.EXPLICIT_AUTHORIZATION_REQUIRED,
      });
    }

    if (
      request.proposedAction.type === "execute_tool" &&
      request.priorAuthorization !== "present"
    ) {
      return Promise.resolve({
        ...auditContext,
        outcome: "prohibited",
        ruleId: BEHAVIOR_RULE_IDS.TOOL_AUTHORIZATION,
        reason: BEHAVIOR_REASON_CODES.EXPLICIT_AUTHORIZATION_REQUIRED,
      });
    }

    const mandatoryConstraints =
      request.externalSideEffects === "none" &&
      request.proposedAction.type !== "execute_tool"
        ? RESPONSE_CONSTRAINTS
        : ([] satisfies readonly BehaviorConstraint[]);

    return Promise.resolve({
      ...auditContext,
      outcome: "permitted",
      ruleId: BEHAVIOR_RULE_IDS.SAFE_SUPPORTED_ACTION,
      reason: BEHAVIOR_REASON_CODES.ACTION_PERMITTED,
      mandatoryConstraints,
    });
  }
}
