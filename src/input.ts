import { Client } from 'discord.js';
import { functions } from './utils';

export function parseInput(message: string, bot: Client) {
  // strip bot ping from message
  const removeBotPing = message.substring(bot.user.id.length + '<@> '.length);
  // count number of "" quotes
  const quoteCount = (removeBotPing.match(/"/g) || []).length;

  // if the message does not contain one of the functions we have created
  // i.e. aesthetic, store, link, etc. then go ahead and return and don't do anything
  if (!functions.some((element) => message.includes(element))) {
    return {
      command: '',
      key: removeBotPing.trim(),
      value: '',
      all: '',
      memeData: []
    };
  }

  let commands: string[];
  // if there is an even number of quotes
  if (quoteCount % 2 === 0) {
    // keep the items in the quotes together
    commands = removeBotPing.split('"').filter((item) => item.trim());
  } else {
    // split the words based on space
    commands = removeBotPing.split(' ').filter((item) => item.trim());
  }

  // set command and key to be the first two items
  const [command, key] = [commands[0], commands[1]];

  // set the meme data based on the previous quote logic
  const memeData = commands
    .map((item) => item.trim())
    .join(' ')
    .split('"')
    .map((item) => item.trim())
    .filter((item) => item);

  // take out the command name
  memeData[0] = memeData[0].substring(command.length).trim();

  // set all to be all of the input except the command name
  const all = commands
    .filter((item) => item !== command)
    .map((item) => item.trim())
    .join(' ');

  // remove the key from all
  const value = all.replace(key, '');

  return {
    command,
    key,
    value,
    all,
    memeData
  };
}
