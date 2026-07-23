import type {
  BehaviorDecision,
  BehaviorRequest,
} from "../../behavior/contracts/index.js";
import type { BehaviorEngine } from "../../ports/behavior-engine.js";
import type { GenerationContextBuilder } from "../../ports/generation-context-builder.js";
import type { ResponseGenerator } from "../../ports/response-generator.js";
import type { GenerationContext } from "../../response/contracts/index.js";
import type {
  EvaluateAction,
  EvaluateActionResult,
} from "../evaluate-action.js";

export function createEvaluateAction<GeneratedResponse>(
  behaviorEngine: BehaviorEngine<BehaviorRequest, BehaviorDecision>,
  generationContextBuilder: GenerationContextBuilder,
  responseGenerator: ResponseGenerator<GenerationContext, GeneratedResponse>,
): EvaluateAction<GeneratedResponse> {
  return async (
    conversation,
    behaviorRequest,
    generationIntent,
  ): Promise<EvaluateActionResult<GeneratedResponse>> => {
    const behaviorDecision = await behaviorEngine.evaluate(behaviorRequest);

    if (behaviorDecision.outcome !== "permitted") {
      return behaviorDecision;
    }

    const generationContext = await generationContextBuilder.build({
      conversation,
      behaviorDecision,
      intent: generationIntent,
    });

    const generatedResponse =
      await responseGenerator.generate(generationContext);

    return {
      ...behaviorDecision,
      generatedResponse,
    };
  };
}
