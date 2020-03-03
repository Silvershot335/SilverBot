import { Client, Message } from 'discord.js';
import { getCommands, getLinks } from './commands';
import { Command } from './database/command.entity';
import { generateInfoMessage } from './info';
import { parseInput } from './input';
import { logger } from './logger';
import { makeMeme } from './meme';
import { findUserLevel } from './points';
import { skipSong } from './song';

const commands: Map<string, string> = new Map();
const links: Map<string, string> = new Map();

// These commands function when the bot is @pinged first.
export function handleBotPing(message: Message, bot: Client) {
  const input = parseInput(message.content, bot);

  // base the logic from the input
  switch (input.command.trim()) {
    case 'skip':
      skipSong(bot);
      break;

    case 'level':
      findUserLevel(message.author.id)
        .then((level) => {
          message.author
            .createDM()
            .then((dmChannel) => {
              dmChannel.send(`You are level ${level}!`);
            })
            .catch(logger.error);
        })
        .catch(logger.error);
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
      Command.create({
        key: input.key,
        value: input.value,
        type: 'command'
      }).save();
      message.delete();
      message.reply(`Stored command ${input.key} value: ${input.value}`);
      break;

    case 'link':
      Command.create({
        key: input.key,
        value: input.value,
        type: 'link'
      });
      break;

    case 'commands':
      getCommands().then((commands) => {
        const response = commands
          .map((c) => `${c.key} -> ${c.value}`)
          .join('\n');

        message.channel.send(response);
      });
      break;

    case 'links':
      getLinks().then((commands) => {
        const response = commands
          .map((c) => `${c.key} -> ${c.value}`)
          .join('\n');

        message.delete();
        message.channel.send(response);
      });
      break;

    default:
      Command.findOne({ where: { key: input.key, type: 'command' } }).then(
        (command) => {
          if (command) {
            message.channel.send(commands.get(input.key));
          }
        }
      );
      break;
  }
}

export function lookForLink(message: Message) {
  Command.findOne({
    where: { key: message.content.trim(), type: 'link' }
  }).then((command) => {
    if (command) {
      message.channel.send(links.get(message.content.trim()));
      message.delete();
    }
  });
}
