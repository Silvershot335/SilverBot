import { Client } from 'discord.js';
import { config } from 'dotenv';
// import { createConnection } from 'typeorm';
// import { createBot } from './bot';
// import { logger } from './logger';
config();
// createConnection()
//   .then((connection) => {
//     createBot(connection);
//   })
//   .catch((err) => {
//     logger.error(err);
//   });

const bot = new Client();
bot.on('ready', async () => {
  console.log('Bot starting up');
  // bot.user.setStatus('invisible');

  // await Promise.all([
  //   setMemes(connection),
  //   addQuestions(connection),
  //   playSong(bot, 'Airplane'),
  // ]);

  // bot.user.setStatus('online');

  console.log('Connected!');
  console.log(`Logged in as ${bot.user.tag}!`);
});
bot.login(process.env.BOT_TOKEN);
