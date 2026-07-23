import type {
  Conversation,
  ConversationId,
  Message,
  NonEmptyReadonlyArray,
  Participant,
  Timestamp,
  TurnId,
} from "../../conversation/index.js";
import type { ConversationStore } from "../../ports/conversation-store.js";
import type { IdGenerator } from "../../ports/id-generator.js";
import type { ContinueConversation } from "../continue-conversation.js";
import type { EndConversation } from "../end-conversation.js";
import type { StartConversation } from "../start-conversation.js";

export interface ConversationUseCases {
  readonly startConversation: StartConversation;
  readonly continueConversation: ContinueConversation;
  readonly endConversation: EndConversation;
}

export function createConversationUseCases(
  conversationStore: ConversationStore,
  conversationIdGenerator: IdGenerator<ConversationId>,
  turnIdGenerator: IdGenerator<TurnId>,
): ConversationUseCases {
  return {
    startConversation: async (
      participants: NonEmptyReadonlyArray<Participant>,
      startedAt: Timestamp,
    ): Promise<Conversation> => {
      const conversation: Conversation = {
        id: await conversationIdGenerator.generate(),
        status: "active",
        participants,
        turns: [],
        startedAt,
      };

      await conversationStore.save(conversation);
      return conversation;
    },

    continueConversation: async (
      conversationId: ConversationId,
      messages: NonEmptyReadonlyArray<Message>,
    ): Promise<Conversation> => {
      const conversation = await conversationStore.load(conversationId);

      if (conversation === undefined) {
        throw new Error(`Conversation not found: ${conversationId}`);
      }

      if (conversation.status !== "active") {
        throw new Error(`Conversation is closed: ${conversationId}`);
      }

      const participantIds = new Set(
        conversation.participants.map((participant) => participant.id),
      );

      if (messages.some((message) => !participantIds.has(message.authorId))) {
        throw new Error("Every message author must be a participant.");
      }

      const continued: Conversation = {
        ...conversation,
        turns: [
          ...conversation.turns,
          {
            id: await turnIdGenerator.generate(),
            sequence: conversation.turns.length + 1,
            messages,
          },
        ],
      };

      await conversationStore.save(continued);
      return continued;
    },

    endConversation: async (
      conversationId: ConversationId,
      closedAt: Timestamp,
    ): Promise<Conversation> => {
      const conversation = await conversationStore.load(conversationId);

      if (conversation === undefined) {
        throw new Error(`Conversation not found: ${conversationId}`);
      }

      if (conversation.status !== "active") {
        throw new Error(`Conversation is already closed: ${conversationId}`);
      }

      const closed: Conversation = {
        ...conversation,
        status: "closed",
        closedAt,
      };

      await conversationStore.save(closed);
      return closed;
    },
  };
}
