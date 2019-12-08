import { Client, Message } from 'discord.js';
import { readFileSync, writeFileSync } from 'fs';
import { logger } from './logger';

const bot = new Client();
const commands: Map<string, string> = new Map();
const links: Map<string, string> = new Map();

function readCommands(map: Map<string, string>, filePath: string) {
  for (const command of JSON.parse(readFileSync(filePath, 'utf8'))) {
    map.set(command.key, command.value);
  }
}

function saveCustomCommandsToFile(
  map: Map<string, string>,
  command: string,
  value: string,
  filePath: string
) {
  map.set(command, value);
  const commands: { key: string; value: string }[] = [];
  map.forEach((value, key) => {
    commands.push({ key, value });
  });
  writeFileSync(filePath, JSON.stringify(commands));
}

function handleBotPing(message: Message) {
  const command = message.content.substring(bot.user.id.length + '<@> '.length);
  const commandArray = command.split(' ').filter((item) => item.trim() !== '');

  if (commandArray[0] === 'aesthetic') {
    message.channel.send(
      commandArray
        .filter((i) => i !== commandArray[0])
        .join('')
        .split('')
        .map((item) => item + ' ')
        .join('')
    );
  }

  if (commandArray[0] === 'store') {
    const value = commandArray
      .filter((item) => item !== commandArray[0] && item !== commandArray[1])
      .join(' ');
    saveCustomCommandsToFile(
      commands,
      commandArray[1],
      value,
      './config/commands.json'
    );
    message.reply(`Stored command ${commandArray[1]} value: ${value}`);
  }

  if (commandArray[0] === 'link') {
    saveCustomCommandsToFile(
      links,
      commandArray[0],
      commandArray[1],
      './config/links.json'
    );
  }

  if (commandArray[0] === 'commands') {
    let reply = '';
    commands.forEach((value, key) => {
      reply += `${key} -> ${value}\n`;
    });
    message.channel.send(reply);
  }

  if (commandArray[0] === 'links') {
    let reply = '';
    links.forEach((value, key) => {
      reply += `${key} -> ${value}\n`;
    });
    message.channel.send(reply);
  }

  if (commands.has(commandArray[0])) {
    message.channel.send(commands.get(commandArray[0]));
  }
}

bot.on('ready', () => {
  logger.info('Connected!');
  logger.info(`Logged in as ${bot.user.tag}!`);

  readCommands(commands, './config/commands.json');
  readCommands(links, './config/links.json');
  bot.user.setPresence({ game: { name: 'Killshot' } });
});

bot.on('message', (message) => {
  if (message.content.toLowerCase().match('(?:^| )vu(?: |$)')) {
    message.channel.send("We do not speak it's name.");
  }
  if (message.content === 'ping') {
    message.reply('Pong!');
  }
  if (message.isMemberMentioned(bot.user)) {
    handleBotPing(message);
  }
  if (links.has(message.content.trim())) {
    message.channel.send(links.get(message.content.trim()));
  }
});

bot.login(readFileSync('./token.txt', 'utf8'));
