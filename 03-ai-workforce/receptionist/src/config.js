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

  if (!allowedLogLevels.has(logLevel)) {
    throw new Error(`Invalid LOG_LEVEL: ${logLevel}`);
  }

  return Object.freeze({
    nodeEnv,
    logLevel,
  });
}

export { loadConfig };

