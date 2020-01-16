import { Client, Message } from 'discord.js';
import { readFileSync, writeFileSync } from 'fs';
import { logger } from './logger';

const bot = new Client();
const commands: Map<string, string> = new Map();
const links: Map<string, string> = new Map();
const functions = ['aesthetic', 'alt', 'store', 'link', 'links', 'commands'];

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

// who the fuck knows

function parseInput(message: string, bot: Client) {
  const removeBotPing = message.substring(bot.user.id.length + '<@> '.length);
  const quoteCount = (removeBotPing.match(/"/g) || []).length;

  // if the message does not contain one of the functions we have created
  // i.e. aesthetic, store, link, etc.
  if (!functions.some((element) => message.includes(element))) {
    return {
      command: '',
      key: removeBotPing.trim(),
      value: '',
      all: ''
    };
  }

  const commands =
    quoteCount === 2
      ? removeBotPing
          .split('"')
          .map((item) => item.trim())
          .filter((item) => item)
      : removeBotPing.split(' ').filter((item) => item.trim());

  const [command, key] = [commands[0], commands[1]];
  const all = commands
    .filter((item) => item !== command)
    .map((item) => item.trim())
    .join(' ');

  const value = all.replace(key, '');

  return {
    command,
    key,
    value,
    all
  };
}

// These commands function when the bot is @pinged first.

function handleBotPing(message: Message) {
  const input = parseInput(message.content, bot);

  if (input.command === 'aesthetic') {
    message.channel.send(
      input.all
        .split('')
        .map((item) => item + ' ')
        .join('')
    );
  }
  if (input.command === 'alt') {
    message.delete();
    message.channel.send('hello');
  }
  if (input.command === 'store') {
    saveCustomCommandsToFile(
      commands,
      input.key,
      input.value,
      './config/commands.json'
    );
    message.delete();
    message.reply(`Stored command ${input.key} value: ${input.value}`);
  }

  if (input.command === 'link') {
    saveCustomCommandsToFile(
      links,
      input.key,
      input.value,
      './config/links.json'
    );
  }

  if (input.command === 'commands') {
    let reply = '';
    commands.forEach((value, key) => {
      reply += `${key} -> ${value}\n`;
    });
    message.channel.send(reply);
  }

  if (input.command === 'links') {
    let reply = '';
    links.forEach((value, key) => {
      reply += `${key} -> ${value}\n`;
    });
    message.delete();
    message.channel.send(reply);
  }

  if (commands.has(input.key)) {
    message.channel.send(commands.get(input.key));
  }
}

bot.on('ready', () => {
  logger.info('Connected!');
  logger.info(`Logged in as ${bot.user.tag}!`);

  readCommands(commands, './config/commands.json');
  readCommands(links, './config/links.json');
  bot.user.setPresence({ game: { name: 'How to Get Physical' } });
});

// The following set of commands will not run if a bot triggers them.

bot.on('message', (message) => {
  if (message.author.bot) {
    return;
  }
  if (message.content === 'I like it.') {
    message.channel.send('F');
  }
});

// These commands will run based on any message containing the included message (or *only* being the message).

bot.on('message', (message) => {
  if (message.content.toLowerCase().match('(?:^| )vu(?: |$)')) {
    message.channel.send('We do not speak its name.');
  }
  if (message.content === 'ping') {
    message.reply('Pong!');
  }
  if (message.content === 'ree') {
    message.react('585982309451300864');
  }
  if (message.isMemberMentioned(bot.user)) {
    handleBotPing(message);
  }
  // && === AND
  // || === OR
  if (
    message.content.match('GG <@[0-9]{18}> you just advanced to level 5!') &&
    message.mentions.members.size === 1
  ) {
    const role = message.guild.roles.find((role) => role.name === 'Venice');
    const member = message.mentions.members.first();

    member.addRole(role).catch(logger.error);
  }
  if (
    message.content.match('GG <@[0-9]{18}> you just advanced to level 10!') &&
    message.mentions.members.size === 1
  ) {
    const role = message.guild.roles.find((role) => role.name === 'Neon');
    const member = message.mentions.members.first();

    member.addRole(role).catch(logger.error);
  }

  if (links.has(message.content.trim())) {
    message.channel.send(links.get(message.content.trim()));
    message.delete();
  }
  if (
    message.content.includes('addrole') &&
    message.member.roles.some((r) =>
      ['Admin', 'Judah', 'Fascist Overlord', 'unaligned'].includes(r.name)
    )
  ) {
    const man = message.mentions.members.first();
    const roll = message.mentions.roles.first();
    message.channel.send('Added Mentioned Role to Mentioned User');
    man.addRole(roll);
    man.removeRole('665020851791462403');
  }
  if (
    message.content.includes('removerole') &&
    message.member.roles.some((r) =>
      ['Carter', 'Judah', 'Fascist Overlord', 'Unaligned'].includes(r.name)
    )
  ) {
    const man2 = message.mentions.members.first();
    const roll2 = message.mentions.roles.first();
    message.channel.send('Removed Mentioned Role from Mentioned User');
    man2.removeRole(roll2);
  }
});
bot.login(readFileSync('./token.txt', 'utf8'));
