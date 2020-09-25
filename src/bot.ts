import { Client, Message, TextChannel } from 'discord.js';
import { Connection } from 'typeorm';
import { logger } from './logger';
import { setMemes } from './meme';
import { handleBotPing, lookForLink } from './pinged-bot';
import { giveUserPoints } from './points';
import { handleRoleCommands } from './roles';
import { playSong } from './song';
import { addQuestions } from './trivia-batch';
import { checkVoiceCommands } from './voice';

function handleSimpleReplies(message: Message, bot: Client) {
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

  if (message.content.toLowerCase().match('killbotdiebotaah')) {
    bot.destroy();
  }

  if (
    (message.channel as TextChannel) &&
    (message.channel as TextChannel).guild.id === '255480736713408513' &&
    message.content.toLowerCase().match(/(?:^| )(overwatch|o\s?w)(?: |$)/)
  ) {
    message.channel.send('bhad gam');
  }

  if (message.content.toLowerCase().match('(?:^| )(v|V)u(?: |$)')) {
    message.channel.send('We do not speak its name.');
  }
  if (message.content.toLowerCase().match('get on your boots')) {
    message.channel.send('The Future Needs a Big Kiss.');
    message.react('462479805229826058');
  }

  checkVoiceCommands(message, bot);
}
export function createBot(connection: Connection) {
  const bot = new Client();

  bot.on('ready', async () => {
    logger.info('Bot starting up');
    bot.user.setStatus('invisible');

    await Promise.all([
      setMemes(connection),
      addQuestions(connection),
      playSong(bot, 'Airplane'),
    ]);

    bot.user.setStatus('online');

    logger.info('Connected!');
    logger.info(`Logged in as ${bot.user.tag}!`);
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

    handleSimpleReplies(message, bot);

    if (message.isMemberMentioned(bot.user)) {
      handleBotPing(message, bot);
    }
    handleRoleCommands(message);
    lookForLink(message);
  });
  bot.login(process.env.BOT_TOKEN);
}
