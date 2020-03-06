import winston from 'winston';
export const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.colorize(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});
