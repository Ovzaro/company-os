function normalizeTelegramMessage(context) {
  const message = context.message;

  return Object.freeze({
    id: message.message_id,
    chatId: context.chat.id,
    threadId: message.message_thread_id ?? null,
    text: message.text ?? message.caption ?? null,
    user: Object.freeze({
      id: context.from?.id ?? null,
      firstName: context.from?.first_name ?? null,
      lastName: context.from?.last_name ?? null,
      username: context.from?.username ?? null,
      languageCode: context.from?.language_code ?? null,
    }),
  });
}

export { normalizeTelegramMessage };
