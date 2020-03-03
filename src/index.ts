import { createConnection } from 'typeorm';
import { createBot } from './bot';
import { logger } from './logger';

createConnection()
  .then((connection) => {
    createBot(connection);
  })
  .catch((err) => {
    logger.error(err);
    createBot(null);
  });
