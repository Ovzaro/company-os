import 'dotenv/config';

const allowedLogLevels = new Set([
  'fatal',
  'error',
  'warn',
  'info',
  'debug',
  'trace',
  'silent',
]);

function loadConfig(environment = process.env) {
  const nodeEnv = environment.NODE_ENV?.trim() || 'development';
  const logLevel = environment.LOG_LEVEL?.trim().toLowerCase() || 'info';
  const telegramBotToken = environment.TELEGRAM_BOT_TOKEN?.trim();

  if (!allowedLogLevels.has(logLevel)) {
    throw new Error(`Invalid LOG_LEVEL: ${logLevel}`);
  }

  if (!telegramBotToken) {
    throw new Error('TELEGRAM_BOT_TOKEN is required');
  }

  return Object.freeze({
    nodeEnv,
    logLevel,
    telegramBotToken,
  });
}

export { loadConfig };
