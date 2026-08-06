class InMemoryConversationStore {
  constructor() {
    this.conversations = new Map();
  }

  findActive(conversationKey) {
    const conversation = this.conversations.get(conversationKey);

    return conversation?.status === 'active' ? conversation : null;
  }

  save(conversationKey, conversation) {
    this.conversations.set(conversationKey, conversation);

    return conversation;
  }
}

export { InMemoryConversationStore };
