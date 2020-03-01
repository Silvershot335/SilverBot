import { Client, Message } from 'discord.js';
import { readFileSync } from 'fs';
import { readCommands, saveCustomCommandsToFile } from './commands';
import { generateInfoMessage } from './info';
import { parseInput } from './input';
import { logger } from './logger';
import { makeMeme, setMemes } from './meme';
import { handleRoleCommands } from './roles';
import { playSong, skipSong } from './song';

const bot = new Client();
const commands: Map<string, string> = new Map();
const links: Map<string, string> = new Map();

// These commands function when the bot is @pinged first.
function handleBotPing(message: Message) {
  const input = parseInput(message.content, bot);
  let reply = '';
  console.log(input)
  // base the logic from the input
  switch (input.command.trim()) {
    case 'skip':
      skipSong(bot);
      break;

    case 'info':
      generateInfoMessage(message);
      break;

    case 'meme':
      makeMeme(input.memeData).then((meme) => message.channel.send(meme));
      break;

    case 'aesthetic':
      message.channel.send(
        input.all
          .split('')
          .map((item) => item + ' ')
          .join('')
      );
      break;

    case 'alt':
      message.delete(1);
      message.channel.send('hello');
      break;

    case 'help':
      message.delete(1);
      message.author.send(
        '```Welcome to SilverBot\n\nCommands:\n@SilverBot meme **meme ID** "top text" "bottom text"\n@SilverBot store **input** *output*\n' +
          '@SilverBot magcord, progressiveprog, poecs``` '
      );
      break;

    case 'mchelp':
      message.delete(1);
      message.author.send(
        '**APOL MC Help**\nIn-Game Commands:\n/sethome\n/home\n/tpa <username>\n\nUseful links:\nhttps://tekxit.fandom.com/wiki/Tekxit_Wiki'
      );
      break;

    case 'store':
      saveCustomCommandsToFile(
        commands,
        input.key,
        input.value,
        './config/commands.json'
      );
      message.delete();
      message.reply(`Stored command ${input.key} value: ${input.value}`);
      break;

    case 'link':
      saveCustomCommandsToFile(
        links,
        input.key,
        input.value,
        './config/links.json'
      );
      break;

    case 'commands':
      commands.forEach((value, key) => {
        reply += `${key} -> ${value}\n`;
      });
      message.channel.send(reply);
      break;

    case 'links':
      links.forEach((value, key) => {
        reply += `${key} -> ${value}\n`;
      });
      message.delete();
      message.channel.send(reply);
      break;

    default:
      if (commands.has(input.key)) {
        message.channel.send(commands.get(input.key));
      }
      break;
  }
}

bot.on('ready', () => {
  logger.info('Connected!');
  logger.info(`Logged in as ${bot.user.tag}!`);

  readCommands(commands, './config/commands.json');
  readCommands(links, './config/links.json');

  setMemes();

  playSong(bot, 'Airplane');
});

// These commands will run based on any message containing the included message (or *only* being the message).
// && === AND
// || === OR

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
  handleRoleCommands(message);
  if (links.has(message.content.trim())) {
    message.channel.send(links.get(message.content.trim()));
    message.delete();
  }
});
// The following set of commands will not run if a bot triggers them.

bot.on('message', (message) => {
  if (message.author.bot) {
    return;
  }
  if (message.content === 'F') {
    message.channel.send('F');
  }
  if (
    message.content.includes('subjective') ||
    message.content.includes('objective')
  ) {
    message.react('👎');
    message.channel.send('Stop Saying That.');
  }
});
bot.login(readFileSync('./token.txt', 'utf8'));
