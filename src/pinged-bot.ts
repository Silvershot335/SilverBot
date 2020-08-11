import { Client, Message } from 'discord.js';
import { getCommands, getLinks } from './commands';
import { Command } from './database/command.entity';
import { generateInfoMessage } from './info';
import { parseInput } from './input';
import { logger } from './logger';
import { portalcalc, roll, tCat } from './math';
import { makeMeme } from './meme';
import { addLevels, findUserLevel } from './points';
import { skipSong } from './song';
import { playSong, stopPlayingSong, uploadSong } from './voice';

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

    case 'portal':
      message.channel.send(portalcalc(message, bot));
      break;

    case 'q':
      message.channel.send(tCat(message, bot));
      break;

    case 'roll':
      message.channel.send(roll(message, bot));
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

    case 'add-levels':
      addLevels(input, message)
        .then((success) => {
          if (success) {
            message.author
              .createDM()
              .then((dmChannel) => {
                const person = message.guild.member(input.key);
                dmChannel.send(`${person.displayName} is now level ${success}`);
              })
              .catch(logger.error);
          }
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

    case 'store':
      Command.create({
        key: input.key,
        value: input.value,
        type: 'command',
      }).save();
      message.delete();
      message.reply(`Stored command ${input.key} value: ${input.value}`);
      break;

    case 'link':
      Command.create({
        key: input.key,
        value: input.value,
        type: 'link',
      }).save();
      message.reply(`Stored link ${input.key} value: ${input.value}`);
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
        message.channel.send(response);
      });
      break;

      case 'upload':
      uploadSong(input, message);
      break;

    case 'play':
      playSong(input, message);
      break;

    case 'stop':
      stopPlayingSong(bot);
      break;

    default:
      Command.findOne({ where: { key: input.key, type: 'command' } }).then(
        (command) => {
          if (command) {
            message.channel.send(command.value);
          }
        }
      );
      break;
  }
}

export function lookForLink(message: Message) {
  Command.findOne({
    where: { key: message.content.trim(), type: 'link' },
  }).then((command) => {
    if (command) {
      message.channel.send(command.value);
    }
  });
}
