import { Command } from './database/command.entity';

export function getCommands() {
  return Command.find({
    select: ['key', 'value', 'type'],
    where: { type: 'command' }
  });
}

export function getLinks() {
  return Command.find({
    select: ['key', 'value', 'type'],
    where: { type: 'link' }
  });
}
