import pino from 'pino';

function createLogger(config) {
  return pino({
    level: config.logLevel,
    base: {
      application: 'receptionist',
      environment: config.nodeEnv,
    },
  });
}

export { createLogger };

