const winston = require('winston');
const { createLogger, format, transports } = winston

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'mingijuk' },
  transports: [
    new transports.File({ filename: './log/error.log', level: 'error' }),
    new transports.File({ filename: './log/combined.log' })
  ]
});

logger.add(new winston.transports.Console({
  format: winston.format.simple(),
}));

logger.stream = {
  write: function (message, encoding) {
    logger.info(message);
  },
};

module.exports = logger;