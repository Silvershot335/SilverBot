import { Message } from 'discord.js';
import { logger } from './logger';

// Moved all previous role logic in here
export function handleRoleCommands(message: Message) {
  if (
    message.content.match('GG <@![0-9]{18}>, you just advanced to level 5!') &&
    message.mentions.members.size === 1
  ) {
    const role = message.guild.roles.find((role) => role.name === 'Venice');
    const member = message.mentions.members.first();

    member.addRole(role).catch(logger.error);
    message.channel.send('Role Added: Venice');
    logger.info(message.content);
  }
  if (
    message.content.match('you just advanced to level 10!') &&
    message.mentions.members.size === 1
  ) {
    const role = message.guild.roles.find((role) => role.name === 'Neon');
    const member = message.mentions.members.first();

    member.addRole(role).catch(logger.error);
    message.channel.send('Role Added: Neon');
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
    man.addRole(roll).catch(logger.error);
    man.removeRole('665020851791462403').catch(logger.error);
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
    man2.removeRole(roll2).catch(logger.error);
  }
}
