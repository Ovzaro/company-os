import { Conversation } from './conversation.js';

const PLACEHOLDER_RESPONSE =
  'Thank you for your message. The conversation system received it successfully.';

function createConversationKey(message) {
  return `${message.chatId}:${message.threadId ?? 'default'}`;
}

class ConversationEngine {
  constructor({ store, clock = () => new Date() }) {
    this.store = store;
    this.clock = clock;
  }

  receive(message) {
    const conversationKey = createConversationKey(message);
    let conversation = this.store.findActive(conversationKey);
    const isNew = conversation === null;

    if (isNew) {
      conversation = new Conversation({
        telegramChatId: message.chatId,
        telegramThreadId: message.threadId,
        telegramUser: message.user,
        now: this.clock(),
      });
    }

    conversation.addIncomingMessage(message, this.clock());
    this.store.save(conversationKey, conversation);

    return Object.freeze({
      conversation,
      isNew,
      response: PLACEHOLDER_RESPONSE,
    });
  }
}

export { ConversationEngine, PLACEHOLDER_RESPONSE, createConversationKey };
