import type {
  BehaviorDecision,
  BehaviorRequest,
} from "../../behavior/contracts/index.js";
import type { BehaviorEngine } from "../../ports/behavior-engine.js";
import type { ResponseGenerator } from "../../ports/response-generator.js";
import type {
  EvaluateAction,
  EvaluateActionResult,
} from "../evaluate-action.js";

export function createEvaluateAction<GenerationContext, GeneratedResponse>(
  behaviorEngine: BehaviorEngine<BehaviorRequest, BehaviorDecision>,
  responseGenerator: ResponseGenerator<GenerationContext, GeneratedResponse>,
): EvaluateAction<GenerationContext, GeneratedResponse> {
  return async (
    conversation,
    behaviorRequest,
    generationContext,
  ): Promise<EvaluateActionResult<GeneratedResponse>> => {
    void conversation;

    const behaviorDecision = await behaviorEngine.evaluate(behaviorRequest);

    if (behaviorDecision.outcome !== "permitted") {
      return behaviorDecision;
    }

    const generatedResponse =
      await responseGenerator.generate(generationContext);

    return {
      ...behaviorDecision,
      generatedResponse,
    };
  };
}
