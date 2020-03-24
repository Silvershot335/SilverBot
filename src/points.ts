import { Message } from 'discord.js';
import { Point } from './database/point.entity';
import { FormattedInput } from './input';
import { logger } from './logger';

const levels: Level[] = [];

interface Level {
  level: number;
  experience: number;
}

function getNow() {
  const date = new Date();
  return (
    date.toLocaleDateString() + ' ' + date.getHours() + ':' + date.getMinutes()
  );
}

async function findPreviousPoints(userID: string) {
  const { sum }: { sum: string } = await Point.createQueryBuilder()
    .select('sum(points)', 'sum')
    .where({ userID })
    .getRawOne();
  return Number(sum);
}

export async function findUserLevel(userID: string) {
  const points = await findPreviousPoints(userID);
  const currentLevel = levels.find((level) => points < level.experience);
  if (currentLevel) {
    return currentLevel.level - 1;
  }
  return -1;
}

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function giveUserPoints(message: Message) {
  if (levels.length === 0) {
    generateLevels();
  }
  const timestamp = getNow();
  const userID = message.author.id;
  const serverID = message.channel.id;
  return Point.findOne({ userID, timestamp, serverID }).then(async (value) => {
    // if there is not a point value for that user in this minute
    if (!value) {
      // Pick a number 0 - 10
      const points = getRandomNumber(5, 8);
      // Look in the database for how many points the user had previously
      const previousPoints = await findPreviousPoints(userID);
      // Find the users current level by the first level where they do not have that much XP
      const currentLevel = levels.find(
        (level) => previousPoints < level.experience
      );
      // If there is a level with more xp than they currently have
      if (currentLevel) {
        // If the amount of points gained for
        // the current message + their current points > how many xp required to level up
        if (previousPoints + points > currentLevel.experience) {
          message.channel.send(
            'Congratulations, you leveled up to level ' + currentLevel.level
          );
          logger.debug(
            `${message.author.username} leveled up to level ${currentLevel.level}!`
          );
        }
      }
      Point.create({ userID, timestamp, points, serverID })
        .save()
        .catch(logger.error);
    }
  });
}

export function generateLevels() {
  let experience = 20;
  for (let i = 1; i < Number(process.env.MAX_DISC_LEVEL || 100); ++i) {
    levels.push({ level: i, experience });
    experience = Math.round(experience * 2);
  }
}

async function checkAddLevelHelp(
  input: FormattedInput,
  message: Message
): Promise<boolean> {
  const member = message.guild.member(input.key);
  if (input.key === 'help' || !member) {
    await message.author
      .createDM()
      .then((dmChannel) => {
        dmChannel.send('Usage: @SilverBot add-levels {userID} {levelToGoTo}');
      })
      .catch(logger.error);
    return true;
  }
  if (member.user.bot) {
    await message.author
      .createDM()
      .then((dmChannel) => {
        dmChannel.send('Cannot add levels to a bot!');
      })
      .catch(logger.error);
    return true;
  }
  return Promise.resolve(false);
}

async function addXPUntilNextLevel(
  input: FormattedInput,
  userID: string,
  nextLevel: Level,
  serverID: string
) {
  const previousXP = await findPreviousPoints(userID);
  let missingXP = nextLevel.experience - previousXP;

  while (missingXP > 2_000_000_000) {
    await Point.create({
      userID,
      timestamp: '1',
      points: 2_000_000_000,
      serverID
    })
      .save()
      .catch(logger.error);
    missingXP -= 2_000_000_000;
  }
  if (missingXP > 0 && missingXP < 2_000_000_000) {
    await Point.create({
      userID,
      timestamp: '1',
      points: missingXP,
      serverID
    })
      .save()
      .catch(logger.error);
  }
  return await findUserLevel(input.key);
}

async function addUntilMaxLevel(
  input: FormattedInput,
  userID: string,
  serverID: string
) {
  let userLevel = await findUserLevel(userID);
  while (userLevel < Number(input.value)) {
    const nextLevel = levels.find((level) => level.level === userLevel + 1);
    if (nextLevel) {
      userLevel = await addXPUntilNextLevel(input, userID, nextLevel, serverID);
    }
  }
  return userLevel;
}

export async function addLevels(
  input: FormattedInput,
  message: Message
): Promise<null | number> {
  // if author is Judah or Chris
  if (
    message.author.id === '177116185006047232' ||
    message.author.id === '167804931439329280'
  ) {
    if (levels.length === 0) {
      generateLevels();
    }
    if (await checkAddLevelHelp(input, message)) {
      return null;
    }

    // userID of the user to give levels to
    const userID = input.key;
    const serverID = message.channel.id;

    return addUntilMaxLevel(input, userID, serverID);
  }
  return Promise.resolve(null);
}
