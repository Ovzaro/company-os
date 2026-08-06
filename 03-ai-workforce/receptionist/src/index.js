import { Telegraf } from 'telegraf';

import { loadConfig } from './config.js';
import { ConversationEngine } from './conversation/conversation-engine.js';
import { InMemoryConversationStore } from './conversation/conversation-store.js';
import { normalizeTelegramMessage } from './conversation/telegram-message.js';
import { createLogger } from './logger.js';

const config = loadConfig();
const logger = createLogger(config);
const bot = new Telegraf(config.telegramBotToken);
const conversationEngine = new ConversationEngine({
  store: new InMemoryConversationStore(),
});

bot.on('message', async (context) => {
  const incomingMessage = normalizeTelegramMessage(context);
  const result = conversationEngine.receive(incomingMessage);

  logger.info(
    {
      direction: 'incoming',
      chatId: incomingMessage.chatId,
      messageId: incomingMessage.id,
      message: incomingMessage.text,
      conversationId: result.conversation.id,
      conversationStatus: result.conversation.status,
      isNewConversation: result.isNew,
    },
    'Telegram message received',
  );

  const sentMessage = await context.reply(result.response);

  logger.info(
    {
      direction: 'outgoing',
      chatId: context.chat.id,
      messageId: sentMessage.message_id,
      message: result.response,
      conversationId: result.conversation.id,
    },
    'Telegram message sent',
  );
});

bot.catch((error, context) => {
  logger.error(
    {
      error,
      updateId: context.update.update_id,
    },
    'Telegram update failed',
  );
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

await bot.launch();

logger.info('Receptionist application started with Telegram long polling');
