import { Client, Message } from 'discord.js';
import { Connection } from 'typeorm';
import { logger } from './logger';
import { setMemes } from './meme';
import { handleBotPing, lookForLink, setCommandsAndLinks } from './pinged-bot';
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
  if (
    message.content.includes('subjective') ||
    message.content.includes('objective')
  ) {
    message.react('👎');
    message.channel.send('Stop Saying That.');
  }
  if (message.content.toLowerCase().match('(?:^| )(v|V)u(?: |$)')) {
    message.channel.send('We do not speak its name.');
  }
}

export function createBot(connection: Connection | null) {
  const bot = new Client();

  bot.on('ready', () => {
    logger.info('Connected!');
    logger.info(`Logged in as ${bot.user.tag}!`);

    setCommandsAndLinks();

    setMemes();

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
    if (connection !== null) {
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