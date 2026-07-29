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

export function createProcessConversationTurn<GeneratedResponse>(
  evaluateAction: EvaluateAction<GeneratedResponse>,
  conversationStore: ConversationStore,
  turnIdGenerator: IdGenerator<TurnId>,
): ProcessConversationTurn<GeneratedResponse> {
  return async (
    conversation,
    incomingMessages,
    behaviorRequest,
    generationIntent,
  ): Promise<ProcessConversationTurnResult<GeneratedResponse>> => {
    assertConversationCanAcceptTurn(conversation, incomingMessages);

    const candidateConversation: Conversation = {
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

    const evaluation = await evaluateAction(
      candidateConversation,
      behaviorRequest,
      generationIntent,
      incomingMessages.map((message) => message.content).join(" "),
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

    await conversationStore.save(candidateConversation);

    const { generatedResponse, ...behaviorDecision } = evaluation;

    return {
      outcome: "permitted",
      behaviorDecision,
      conversation: candidateConversation,
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
