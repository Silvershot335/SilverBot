import { config } from 'dotenv';
import { createConnection } from 'typeorm';
import { createBot } from './bot';
import { logger } from './logger';
config();
createConnection()
  .then((connection) => {
    createBot(connection);
  })
  .catch((err) => {
    logger.error(err);
  });

