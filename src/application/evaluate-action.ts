import type {
  BehaviorDecision,
  BehaviorRequest,
} from "../behavior/contracts/index.js";
import type { Conversation } from "../conversation/index.js";

type DecisionWithOutcome<Outcome extends BehaviorDecision["outcome"]> = Extract<
  BehaviorDecision,
  { readonly outcome: Outcome }
>;

export type EvaluateActionResult<GeneratedResponse> =
  | DecisionWithOutcome<"prohibited">
  | DecisionWithOutcome<"escalation_required">
  | (DecisionWithOutcome<"permitted"> & {
      readonly generatedResponse: GeneratedResponse;
    });

/**
 * Evaluates a proposed receptionist action before any language is generated.
 *
 * Policy outcomes are returned as values. Only a permitted decision includes a
 * generated response; prohibited and escalation-required decisions end the
 * orchestration without generation or conversation mutation.
 */
export type EvaluateAction<GenerationContext, GeneratedResponse> = (
  conversation: Conversation,
  behaviorRequest: BehaviorRequest,
  generationContext: GenerationContext,
) => Promise<EvaluateActionResult<GeneratedResponse>>;
