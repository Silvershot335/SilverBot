import { Client, Message } from 'discord.js';
import { Connection } from 'typeorm';
import { logger } from './logger';
import { setMemes } from './meme';
import { handleBotPing, lookForLink } from './pinged-bot';
import { giveUserPoints } from './points';
import { handleRoleCommands } from './roles';
import { playSong } from './song';

function handleSimpleReplies(message: Message) {
  switch (message.content.trim()) {
    case 'F':
      message.channel.send('F');
      return;
    case 'ping':
      message.channel.send('Pong!');
      return;
    case 'ree':
      message.react('585982309451300864');
      return;
  }
 /* if (
    message.content.toLowerCase().includes('subjective') ||
    message.content.toLowerCase().includes('objective')
  ) {
    message.react('😒');
  }*/
  if (message.content.toLowerCase().match('(?:^| )(v|V)u(?: |$)')) {
    message.channel.send('We do not speak its name.');
  }
  if (message.content.toLowerCase().match('get on your boots')) {
    message.channel.send('Sexy Boots');
    message.react('462479805229826058');
  }
}

export function createBot(connection: Connection) {
  const bot = new Client();

  bot.on('ready', () => {
    logger.info('Connected!');
    logger.info(`Logged in as ${bot.user.tag}!`);

    setMemes(connection);

    playSong(bot, 'Airplane');
  });

  // These commands will run based on any message containing the included message (or *only* being the message).
  // && === AND
  // || === OR

  bot.on('message', async (message) => {
    if (message.author.bot) {
      return;
    }

    // if the database connection was successful
    if (connection) {
      await giveUserPoints(message);
    }

    handleSimpleReplies(message);

    if (message.isMemberMentioned(bot.user)) {
      handleBotPing(message, bot);
    }
    handleRoleCommands(message);
    lookForLink(message);
  });
  bot.login(process.env.BOT_TOKEN);
}
