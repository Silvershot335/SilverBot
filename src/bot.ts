import Discord, { User, Member } from 'discord.io';
import fs from 'fs';
import winston, { silly } from 'winston';
import { BADQUERY } from 'dns';

const SilverBot = new Discord.Client({
  token: fs.readFileSync('./token.txt', 'utf8'),
  autorun: true
});

let map: Map<string, string>;

function saveCustomCommandsToFile(command: string, value: string) {
  map.set(command, value);
  const commands: { key: string; value: string }[] = [];
  map.forEach((value, key) => {
    commands.push({ key, value });
  });
  fs.writeFileSync('./config/commands.json', JSON.stringify(commands));
}

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.colorize(),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

SilverBot.on('ready', () => {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(`${SilverBot.username} ~~ (${SilverBot.id})`);
  SilverBot.setPresence({
    idle_since: 'no',
    game: {
      name: 'Killshot',
      type: 2
    }
  });
  SilverBot.getMembers
  map = new Map<string, string>();
  for (const command of JSON.parse(
    fs.readFileSync('./config/commands.json', 'utf8')
  )) {
    map.set(command.key, command.value);
  }
  console.log (Member)
});

SilverBot.on('disconnect', (errMsg, code) => {
  logger.error('Bot disconnected');
  logger.error(`message: ${errMsg} - error code: ${code}`);
  SilverBot.connect();
});

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
SilverBot.on('message', (user, userID, channelID, message, event) => {
  const actualCase = message;
  message = message.toLowerCase();
  const link = getLinkFromMessage(message);
  if (link) {
    SilverBot.sendMessage({
      to: channelID,
      message: link
    });
  }
  if (message === 'fuck you') {
    SilverBot.sendMessage({
      to: channelID,
      message: 'you dumb motherfucker'
    });
  }
  if (
    message.includes('who is magdalena bay') ||
    message.includes('who is magbay')
  ) {
    SilverBot.sendMessage({
      to: channelID,
      message:
        'Magdalena Bay is a pop duo comprised of Mica Tenenbaum (songwriting and vocals) and Matthew Lewin (songwriting, vocals and production). The duo has been writing together since high school and started making pop as Magdalena Bay in 2016. Inspiration is drawn from retro pop songwriting and contemporary production-- the result has been a collection of upbeat and synth-driven singles.'
    });
  }
  if (message.includes('vu')) {
    SilverBot.sendMessage({
      to: channelID,
      message: "We do not speak it's name."
    });
  }
  if (message.indexOf(`<@${SilverBot.id}>`) === 0) {
    const command = actualCase.substring(SilverBot.id.length + '<@> '.length);
    const commandArray = command.split(' ').filter(item => item.trim() !== '');

    if (commandArray[0] === 'aesthetic') {
      SilverBot.sendMessage({
        to: channelID,
        message: commandArray
          .filter(i => i !== commandArray[0])
          .join('')
          .split('')
          .map(item => item + ' ')
          .join('')
      });
    }

    if (commandArray[0] === 'store') {
      const value = commandArray
        .filter(item => item !== commandArray[0] && item !== commandArray[1])
        .join(' ');
      saveCustomCommandsToFile(commandArray[1], value);
      SilverBot.sendMessage({
        to: channelID,
        message: `Stored command ${commandArray[1]} -- value: ${value}`
      });
    }

    if (commandArray[0] === 'commands') {
      let commands = '';
      map.forEach((value, key) => {
        commands += `${key} -> ${value}\n`;
      });
      SilverBot.sendMessage({
        to: channelID,
        message: commands
      });
    }

    if (map.has(commandArray[0])) {
      SilverBot.sendMessage({
        to: channelID,
        message: `${map.get(commandArray[0])}`
      });
    }
  }
  let serverID = '648728910657486848';
  let venice = '651264806082576395';
  let judy = '167804931439329280';
  let man = '177116185006047232';

  if (message.includes(`, you just advanced to level 5!`)) {
    const command = actualCase.substring(SilverBot.id.length + '<@> '.length);
    const commandArray = command.split(' ').filter(item => item.trim() !== '');
    SilverBot.sendMessage({
      to: channelID,
      message: 'Working'
    });
  }

  if (message.includes(`, you just advanced to level 5!`)) {
    SilverBot.addToRole({
      serverID: serverID,
      role: venice,
      userID: judy
    });
  }
});
