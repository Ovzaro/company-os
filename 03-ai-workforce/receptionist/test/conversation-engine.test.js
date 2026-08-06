import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ConversationEngine,
  PLACEHOLDER_RESPONSE,
} from '../src/conversation/conversation-engine.js';
import { InMemoryConversationStore } from '../src/conversation/conversation-store.js';

function createMessage(overrides = {}) {
  return {
    id: 100,
    chatId: 200,
    threadId: null,
    text: 'What services do you offer?',
    user: {
      id: 300,
      firstName: 'Taylor',
      lastName: null,
      username: 'taylor',
      languageCode: 'en',
    },
    ...overrides,
  };
}

test('creates a new conversation for the first message', () => {
  const engine = new ConversationEngine({
    store: new InMemoryConversationStore(),
    clock: () => new Date('2026-07-16T12:00:00.000Z'),
  });

  const result = engine.receive(createMessage());

  assert.equal(result.isNew, true);
  assert.match(result.conversation.id, /^[0-9a-f-]{36}$/);
  assert.equal(result.conversation.status, 'active');
  assert.equal(result.conversation.messageCount, 1);
  assert.equal(result.response, PLACEHOLDER_RESPONSE);
});

test('continues the active conversation for the same Telegram chat', () => {
  const engine = new ConversationEngine({
    store: new InMemoryConversationStore(),
  });

  const first = engine.receive(createMessage());
  const second = engine.receive(
    createMessage({ id: 101, text: 'Here is some more information.' }),
  );

  assert.equal(second.isNew, false);
  assert.equal(second.conversation.id, first.conversation.id);
  assert.equal(second.conversation.messageCount, 2);
  assert.equal(second.conversation.messages[1].text, 'Here is some more information.');
});

test('creates separate conversations for separate Telegram threads', () => {
  const engine = new ConversationEngine({
    store: new InMemoryConversationStore(),
  });

  const first = engine.receive(createMessage({ threadId: 10 }));
  const second = engine.receive(createMessage({ threadId: 11 }));

  assert.equal(second.isNew, true);
  assert.notEqual(second.conversation.id, first.conversation.id);
});

test('prepares metadata for future knowledge loading without loading knowledge', () => {
  const engine = new ConversationEngine({
    store: new InMemoryConversationStore(),
  });

  const result = engine.receive(createMessage());

  assert.deepEqual(result.conversation.knowledgeContext, {
    conversationId: result.conversation.id,
    channel: 'telegram',
    customerMessage: 'What services do you offer?',
    customerLocale: 'en',
  });
});
