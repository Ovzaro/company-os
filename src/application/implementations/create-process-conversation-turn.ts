import type {
  Conversation,
  Message,
  NonEmptyReadonlyArray,
  TurnId,
} from "../../conversation/index.js";
import type { ConversationStore } from "../../ports/conversation-store.js";
import type { IdGenerator } from "../../ports/id-generator.js";
import type { EvaluateAction } from "../evaluate-action.js";
import type {
  ProcessConversationTurn,
  ProcessConversationTurnResult,
} from "../process-conversation-turn.js";

export function createProcessConversationTurn<
  GenerationContext,
  GeneratedResponse,
>(
  evaluateAction: EvaluateAction<GenerationContext, GeneratedResponse>,
  conversationStore: ConversationStore,
  turnIdGenerator: IdGenerator<TurnId>,
): ProcessConversationTurn<GenerationContext, GeneratedResponse> {
  return async (
    conversation,
    incomingMessages,
    behaviorRequest,
    generationContext,
  ): Promise<ProcessConversationTurnResult<GeneratedResponse>> => {
    const evaluation = await evaluateAction(
      conversation,
      behaviorRequest,
      generationContext,
    );

    if (evaluation.outcome === "prohibited") {
      return {
        outcome: "prohibited",
        behaviorDecision: evaluation,
      };
    }

    if (evaluation.outcome === "escalation_required") {
      return {
        outcome: "escalation_required",
        behaviorDecision: evaluation,
      };
    }

    assertConversationCanAcceptTurn(conversation, incomingMessages);

    const updatedConversation: Conversation = {
      ...conversation,
      turns: [
        ...conversation.turns,
        {
          id: await turnIdGenerator.generate(),
          sequence: conversation.turns.length + 1,
          messages: incomingMessages,
        },
      ],
    };

    await conversationStore.save(updatedConversation);

    const { generatedResponse, ...behaviorDecision } = evaluation;

    return {
      outcome: "permitted",
      behaviorDecision,
      conversation: updatedConversation,
      generatedResponse,
    };
  };
}

function assertConversationCanAcceptTurn(
  conversation: Conversation,
  incomingMessages: NonEmptyReadonlyArray<Message>,
): void {
  if (conversation.status !== "active") {
    throw new Error(`Conversation is closed: ${conversation.id}`);
  }

  const participantIds = new Set(
    conversation.participants.map((participant) => participant.id),
  );

  if (
    incomingMessages.some((message) => !participantIds.has(message.authorId))
  ) {
    throw new Error("Every message author must be a participant.");
  }
}
