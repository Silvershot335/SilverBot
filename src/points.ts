import { Message, TextChannel } from 'discord.js';
import { LessThanOrEqual } from 'typeorm';
import { Point } from './database/point.entity';
import { Role } from './database/role.entity';
import { FormattedInput } from './input';
import { logger } from './logger';
import { getNow, getRandomNumber } from './utils';

const levels: Level[] = [];

interface Level {
  level: number;
  experience: number;
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

async function getUsersRole(serverID: string, currentLevel: Level) {
  const roles = await Role.find({
    serverID,
    level: LessThanOrEqual(currentLevel.level),
  });
  return roles.map((role) => role.role);
}

export async function giveUserPoints(message: Message) {
  if (message.channel instanceof TextChannel) {
    if (levels.length === 0) {
      generateLevels();
    }
    const timestamp = getNow();
    const userID = message.author.id;
    const serverID = message.channel.guild.id;
    const value = await Point.findOne({ userID, timestamp, serverID });
    // if there is not a point value for that user in this minute
    if (!value) {
      // Pick a number 5 - 8
      const points = getRandomNumber(10, 12);
      // Look in the database for how many points the user had previously
      const previousPoints = await findPreviousPoints(userID);
      // Find the users current level by the first level where they do not have that much XP
      const currentLevel = levels.find(
        (level) => previousPoints < level.experience
      );
      // If there is a level with more xp than they currently have (100 or less)
      if (currentLevel) {
        // If they  leveled up
        if (previousPoints + points > currentLevel.experience) {
          message.channel.send(
            'Congratulations, you leveled up to level ' + currentLevel.level
          );
          // person who sent the message
          const user = message.guild.member(message.author);
          // roles user should have
          const usersRoles = await getUsersRole(serverID, currentLevel);
          // roles that that person does not have but should have
          const roles = usersRoles.filter(
            (roleName) =>
              !user.roles.array().some((role) => {
                return role.name === roleName;
              })
          );
          if (roles.length) {
            // for each role they don't have
            for (const roleToAdd of roles) {
              // add it
              user
                .addRole(
                  message.guild.roles.find(
                    (existingRole) => roleToAdd === existingRole.name
                  )
                )
                .catch(logger.error);
            }
            if (roles.length > 1) {
              message.channel.send(`Roles Added: ${roles.join(', ')}`);
            } else {
              message.channel.send(`Role Added: ${roles[0]}`);
            }
          }
          logger.debug(
            `${message.author.username} leveled up to level ${currentLevel.level}!`
          );
        }
      }
      Point.create({ userID, timestamp, points, serverID })
        .save()
        .catch(logger.error);
    }
  } else {
    return Promise.resolve();
  }
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
      serverID,
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
      serverID,
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
