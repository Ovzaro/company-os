export const BEHAVIOR_RULE_IDS = {
  EXPLICIT_ESCALATION: "behavior.explicit_escalation",
  SUPPORTED_SCOPE: "behavior.supported_scope",
  UNAMBIGUOUS_POLICY_CONTEXT: "behavior.unambiguous_policy_context",
  SIDE_EFFECT_AUTHORIZATION: "behavior.side_effect_authorization",
  TOOL_AUTHORIZATION: "behavior.tool_authorization",
  SAFE_SUPPORTED_ACTION: "behavior.safe_supported_action",
} as const;

export type BehaviorRuleId =
  (typeof BEHAVIOR_RULE_IDS)[keyof typeof BEHAVIOR_RULE_IDS];

export const BEHAVIOR_REASON_CODES = {
  HUMAN_ESCALATION_REQUIRED: "human_escalation_required",
  UNSUPPORTED_SCOPE: "unsupported_scope",
  AMBIGUOUS_POLICY_CONTEXT: "ambiguous_policy_context",
  EXPLICIT_AUTHORIZATION_REQUIRED: "explicit_authorization_required",
  ACTION_PERMITTED: "action_permitted",
} as const;

export type BehaviorReasonCode =
  (typeof BEHAVIOR_REASON_CODES)[keyof typeof BEHAVIOR_REASON_CODES];

export type BehaviorConstraint =
  "do_not_execute_tools" | "do_not_create_external_side_effects";
