import { Client } from 'discord.js';
import { functions } from './utils';

export interface FormattedInput {
  command: string;
  key: string;
  value: string;
  all: string;
  memeData: string[];
}

export function parseInput(message: string, bot: Client): FormattedInput {
  // strip bot ping from message
  let key = message.substring(bot.user.id.length + '<@> '.length).trim();
  // count number of "" quotes
  const quoteCount = (key.match(/"/g) || []).length;

  // if the message does not contain one of the functions we have created
  // i.e. aesthetic, store, link, etc. then go ahead and return and don't do anything
  if (!functions.some((element) => message.includes(element))) {
    return {
      command: '',
      key,
      value: '',
      all: '',
      memeData: []
    };
  }

  let commands: string[];
  // if there is an even number of quotes
  if (quoteCount % 2 === 0 && quoteCount !== 0) {
    // keep the items in the quotes together
    commands = key
      .split('"')
      .map((item) => item.trim())
      .filter((item) => item.trim());
  } else {
    // split the words based on space
    commands = key
      .split(' ')
      .map((item) => item.trim())
      .filter((item) => item.trim());
  }

  let command: string;
  let memeData: string[] = [];
  // if the first word after ping is meme
  if (commands[0].substring(0, 4) === 'meme') {
    // set command to meme
    command = 'meme';
    // take out meme from the commands array
    commands[0] = commands[0].substring(5);
    // remove any empty entries in the array
    commands = commands.filter((command) => command.trim());
    // set meme data to the rest of the array
    memeData = commands;
  } else {
    // otherwise, do as before
    command = commands[0]?.trim() || '';
    key = commands[1]?.trim() || '';
  }

  // set all to be all of the input except the command name
  const all =
    commands
      .filter((item) => item !== command)
      .map((item) => item.trim())
      .join(' ')
      ?.trim() || '';

  // remove the key from all
  const value = all.replace(key, '')?.trim() || '';

  return {
    command,
    key,
    value,
    all,
    memeData
  };
}
