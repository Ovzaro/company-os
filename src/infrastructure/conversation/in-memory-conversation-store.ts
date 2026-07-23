import type { Conversation, ConversationId } from "../../conversation/index.js";
import type { ConversationStore } from "../../ports/conversation-store.js";

export class InMemoryConversationStore implements ConversationStore {
  readonly #conversations = new Map<ConversationId, Conversation>();

  load(conversationId: ConversationId): Promise<Conversation | undefined> {
    return Promise.resolve(this.#conversations.get(conversationId));
  }

  save(conversation: Conversation): Promise<void> {
    this.#conversations.set(conversation.id, conversation);
    return Promise.resolve();
  }
}
