import { readFileSync, writeFileSync } from 'fs';

export function readCommands(map: Map<string, string>, filePath: string) {
  for (const command of JSON.parse(readFileSync(filePath, 'utf8'))) {
    map.set(command.key, command.value);
  }
}

export function saveCustomCommandsToFile(
  map: Map<string, string>,
  command: string,
  value: string,
  filePath: string
) {
  map.set(command, value);
  const commands: { key: string; value: string }[] = [];
  map.forEach((value, key) => {
    commands.push({ key, value });
  });
  writeFileSync(filePath, JSON.stringify(commands));
}
