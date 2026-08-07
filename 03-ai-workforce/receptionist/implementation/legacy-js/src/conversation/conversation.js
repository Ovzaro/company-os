import { randomUUID } from 'node:crypto';

const CONVERSATION_STATUS = Object.freeze({
  ACTIVE: 'active',
});

class Conversation {
  constructor({
    telegramChatId,
    telegramThreadId = null,
    telegramUser,
    id = randomUUID(),
    now = new Date(),
  }) {
    const timestamp = now.toISOString();

    this.id = id;
    this.channel = 'telegram';
    this.telegramChatId = telegramChatId;
    this.telegramThreadId = telegramThreadId;
    this.telegramUser = telegramUser;
    this.status = CONVERSATION_STATUS.ACTIVE;
    this.createdAt = timestamp;
    this.updatedAt = timestamp;
    this.messages = [];
    this.knowledgeContext = null;
  }

  addIncomingMessage(message, now = new Date()) {
    const receivedAt = now.toISOString();
    const normalizedMessage = Object.freeze({
      id: message.id,
      direction: 'incoming',
      text: message.text,
      receivedAt,
    });

    this.messages.push(normalizedMessage);
    this.updatedAt = receivedAt;
    this.telegramUser = message.user;
    this.knowledgeContext = Object.freeze({
      conversationId: this.id,
      channel: this.channel,
      customerMessage: message.text,
      customerLocale: message.user.languageCode,
    });

    return normalizedMessage;
  }

  get messageCount() {
    return this.messages.length;
  }
}

export { CONVERSATION_STATUS, Conversation };
