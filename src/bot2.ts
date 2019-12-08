// import * as Discord from 'discord.js';
import { Client } from 'discord.js';
import { readFileSync, writeFileSync } from 'fs';
import { logger } from './logger';

const bot = new Client();

function readCommands() {
  const map = new Map<string, string>();
  for (const command of JSON.parse(
    readFileSync('./config/commands.json', 'utf8')
  )) {
    map.set(command.key, command.value);
  }
  return map;
}

function getLinkFromMessage(message: string) {
  if (message === 'magcord') {
    return 'https://discord.gg/TAsqJer';
  }
  if (message === 'r/magdalenabay') {
    return 'https://reddit.com/r/MagdalenaBay';
  }
  if (message.includes('progressive prog')) {
    return 'https://www.reddit.com/r/ProgressiveProg/';
  }
  if (message.includes('poecs') || message.includes('poe cheat sheet')) {
    return 'https://silvershot335.github.io/PoECheatSheet/';
  }
  return null;
}

bot.on('ready', () => {
  logger.info('Connected!');
  logger.info(`Logged in as ${bot.user.tag}!`);
  readCommands();
  bot.user.setPresence({ game: { name: 'Killshot' } });
});

bot.on('message', (message) => {
  const link = getLinkFromMessage(message.content);
  if (link) {
    message.channel.sendMessage(link);
  }
  if (message.content === 'ping') {
    message.reply('Pong!');
  }
});

bot.login(readFileSync('./token.txt', 'utf8'));
