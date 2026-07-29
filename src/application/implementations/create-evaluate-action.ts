import { buildKnowledgeQuery } from "./knowledge-query-planner.js";

import type {
  BehaviorDecision,
  BehaviorRequest,
} from "../../behavior/contracts/index.js";
import type { BehaviorEngine } from "../../ports/behavior-engine.js";
import type { GenerationContextBuilder } from "../../ports/generation-context-builder.js";
import type { KnowledgeRetriever } from "../../ports/knowledge-retriever.js";
import type { ResponseGenerator } from "../../ports/response-generator.js";
import type {
  KnowledgeRequest,
  KnowledgeResult,
  ReceptionistGuidanceProfile,
} from "../../knowledge/index.js";
import type { GenerationContext } from "../../response/contracts/index.js";
import type {
  EvaluateAction,
  EvaluateActionResult,
} from "../evaluate-action.js";

export function createEvaluateAction<GeneratedResponse>(
  behaviorEngine: BehaviorEngine<BehaviorRequest, BehaviorDecision>,
  knowledgeRetriever: KnowledgeRetriever<
    KnowledgeRequest,
    KnowledgeResult
  >,
  generationContextBuilder: GenerationContextBuilder,
  responseGenerator: ResponseGenerator<
    GenerationContext,
    GeneratedResponse
  >,
): EvaluateAction<GeneratedResponse> {
  return async (
    conversation,
    behaviorRequest,
    generationIntent,
    knowledgeQuery,
  ): Promise<EvaluateActionResult<GeneratedResponse>> => {
    const behaviorDecision =
      await behaviorEngine.evaluate(behaviorRequest);

    if (behaviorDecision.outcome !== "permitted") {
      return behaviorDecision;
    }

    const query =
      knowledgeQuery ?? buildKnowledgeQuery(conversation);

    const knowledge =
      await knowledgeRetriever.retrieve({
        query,
        guidanceProfile:
          generationIntentToGuidanceProfile(
            generationIntent,
          ),
      });

    const generationContext =
      await generationContextBuilder.build({
        conversation,
        behaviorDecision,
        intent: generationIntent,
        knowledge,
      });

    const generatedResponse =
      await responseGenerator.generate(
        generationContext,
      );

    return {
      ...behaviorDecision,
      generatedResponse,
    };
  };
}

function generationIntentToGuidanceProfile(
  intent: GenerationContext["intent"],
): ReceptionistGuidanceProfile {
  switch (intent.type) {
    case "answer":
      return "answer";

    case "ask_clarifying_question":
      return "clarify";

    case "acknowledge":
      return "acknowledge";

    case "escalate_handoff":
      return "handoff";
  }
}

