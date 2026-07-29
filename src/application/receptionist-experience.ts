import type {
  BehaviorRequest,
  EmployeeId,
  PolicyScopeId,
} from "../behavior/contracts/index.js";
import type {
  Conversation,
  MessageId,
  ParticipantId,
  Timestamp,
} from "../conversation/index.js";
import type {
  GeneratedResponse,
  GenerationIntent,
} from "../response/contracts/index.js";

export const RECEPTIONIST_GREETING =
  "Welcome to Ovzaro. I’m the Ovzaro Receptionist. I can answer questions about Ovzaro and help point you in the right direction. How can I help you today?";

export interface ReceptionistExperience {
  readonly greeting: string;
  start(): Promise<Conversation>;
  respond(
    conversation: Conversation,
    visitorMessage: string,
  ): Promise<{
    readonly conversation: Conversation;
    readonly text: string;
  }>;
}

export interface ReceptionistExperienceApplication {
  readonly startConversation: (
    participants: readonly [
      {
        readonly id: ParticipantId;
        readonly kind: "human";
        readonly displayName: string;
      },
      {
        readonly id: ParticipantId;
        readonly kind: "digital-employee";
        readonly displayName: string;
      },
    ],
    startedAt: Timestamp,
  ) => Promise<Conversation>;
  readonly continueConversation: (
    conversationId: Conversation["id"],
    messages: readonly [
      {
        readonly id: MessageId;
        readonly authorId: ParticipantId;
        readonly content: string;
        readonly createdAt: Timestamp;
      },
    ],
  ) => Promise<Conversation>;
  readonly processConversationTurn: (
    conversation: Conversation,
    incomingMessages: readonly [
      {
        readonly id: MessageId;
        readonly authorId: ParticipantId;
        readonly content: string;
        readonly createdAt: Timestamp;
      },
    ],
    behaviorRequest: BehaviorRequest,
    generationIntent: GenerationIntent,
  ) => Promise<
    | { readonly outcome: "prohibited" | "escalation_required" }
    | {
        readonly outcome: "permitted";
        readonly conversation: Conversation;
        readonly generatedResponse: GeneratedResponse;
      }
  >;
}

const VISITOR_ID = "terminal-visitor" as ParticipantId;
const RECEPTIONIST_ID = "ovzaro-receptionist" as ParticipantId;

export function createReceptionistExperience(
  application: ReceptionistExperienceApplication,
): ReceptionistExperience {
  let nextMessageId = 1;
  const messageId = (): MessageId =>
    `message-${String(nextMessageId++)}` as MessageId;
  const now = (): Timestamp => new Date().toISOString() as Timestamp;

  return {
    greeting: RECEPTIONIST_GREETING,
    start: async () => {
      const conversation = await application.startConversation(
        [
          { id: VISITOR_ID, kind: "human", displayName: "Visitor" },
          {
            id: RECEPTIONIST_ID,
            kind: "digital-employee",
            displayName: "Ovzaro Receptionist",
          },
        ],
        now(),
      );
      return application.continueConversation(conversation.id, [
        {
          id: messageId(),
          authorId: RECEPTIONIST_ID,
          content: RECEPTIONIST_GREETING,
          createdAt: now(),
        },
      ]);
    },
    respond: async (conversation, visitorMessage) => {
      const intent = classifyGenerationIntent(visitorMessage);
      const result = await application.processConversationTurn(
        conversation,
        [
          {
            id: messageId(),
            authorId: VISITOR_ID,
            content: visitorMessage,
            createdAt: now(),
          },
        ],
        {
          employeeId: "ovzaro-receptionist" as EmployeeId,
          policyScopeId: "public-information" as PolicyScopeId,
          proposedAction:
            intent.type === "ask_clarifying_question"
              ? { type: "ask_clarifying_question" }
              : intent.type === "escalate_handoff"
                ? { type: "escalate" }
                : { type: "respond" },
          externalSideEffects: "none",
          priorAuthorization: "absent",
          supportedScope: "supported",
          escalation: "not_required",
        },
        intent,
      );

      if (result.outcome !== "permitted") {
        throw new Error(`Receptionist response was ${result.outcome}.`);
      }

      const completedConversation = await application.continueConversation(
        result.conversation.id,
        [
          {
            id: messageId(),
            authorId: RECEPTIONIST_ID,
            content: result.generatedResponse.text,
            createdAt: now(),
          },
        ],
      );
      return {
        conversation: completedConversation,
        text: result.generatedResponse.text,
      };
    },
  };
}

export function classifyGenerationIntent(
  message: string,
):
  | { readonly type: "answer" }
  | { readonly type: "ask_clarifying_question" }
  | { readonly type: "acknowledge" }
  | { readonly type: "escalate_handoff" } {
  const normalized = message.toLowerCase().trim();
  if (
    /^(thanks|thank you|thx|hello|hi|hey|good (?:morning|afternoon|evening))[!. ]*$/u.test(
      normalized,
    )
  ) {
    return { type: "acknowledge" };
  }
  if (
    /\b(speak|talk|connect|meet)\b.*\b(human|person|someone|team|representative)\b/u.test(
      normalized,
    ) ||
    /\bhuman (?:help|support|handoff)\b/u.test(normalized)
  ) {
    return { type: "escalate_handoff" };
  }
  if (
    /\b(?:need|want|looking for) help\b/u.test(normalized) ||
    /\bhelp (?:automating|automate|with) (?:my|our) business\b/u.test(
      normalized,
    ) ||
    /^(?:could|can|would) (?:ovzaro|you) help (?:me|us)\??$/u.test(normalized)
  ) {
    return { type: "ask_clarifying_question" };
  }
  return { type: "answer" };
}
