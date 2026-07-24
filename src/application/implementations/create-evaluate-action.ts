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
} from "../../knowledge/index.js";
import type { GenerationContext } from "../../response/contracts/index.js";
import type {
  EvaluateAction,
  EvaluateActionResult,
} from "../evaluate-action.js";

export function createEvaluateAction<GeneratedResponse>(
  behaviorEngine: BehaviorEngine<BehaviorRequest, BehaviorDecision>,
  knowledgeRetriever: KnowledgeRetriever<KnowledgeRequest, KnowledgeResult>,
  generationContextBuilder: GenerationContextBuilder,
  responseGenerator: ResponseGenerator<GenerationContext, GeneratedResponse>,
): EvaluateAction<GeneratedResponse> {
  return async (
    conversation,
    behaviorRequest,
    generationIntent,
    knowledgeQuery,
  ): Promise<EvaluateActionResult<GeneratedResponse>> => {
    const behaviorDecision = await behaviorEngine.evaluate(behaviorRequest);

    if (behaviorDecision.outcome !== "permitted") {
      return behaviorDecision;
    }

    const query = knowledgeQuery ?? conversationQuery(conversation);
    const knowledge = await knowledgeRetriever.retrieve({ query });

    const generationContext = await generationContextBuilder.build({
      conversation,
      behaviorDecision,
      intent: generationIntent,
      knowledge,
    });

    const generatedResponse =
      await responseGenerator.generate(generationContext);

    return {
      ...behaviorDecision,
      generatedResponse,
    };
  };
}

function conversationQuery(
  conversation: Parameters<EvaluateAction<unknown>>[0],
): string {
  return conversation.turns
    .flatMap((turn) => turn.messages)
    .map((message) => message.content)
    .join(" ");
}
