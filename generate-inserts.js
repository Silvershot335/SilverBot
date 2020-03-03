const readFileSync = require('fs').readFileSync;

function genCommands() {
  const commands = JSON.parse(
    readFileSync('./config/commands.json', { encoding: 'utf-8' })
  );

  let insert = 'insert into command (type, key, value) values ';
  for (const command of commands) {
    insert += `('command', '${replace(command.key)}', '${replace(
      command.value
    )}'),`;
  }
  insert = insert.substring(0, insert.length - 1);
  insert += ';';
  return insert;
}

replace = (s) => {
  return s.replace(/'/g, "''");
};

function genLinks() {
  const links = JSON.parse(
    readFileSync('./config/links.json', { encoding: 'utf-8' })
  );

  let insert = 'insert into command (type, key, value) values ';
  for (const link of links) {
    insert += `('link', '${replace(link.key)}', '${replace(link.value)}'),`;
  }
  insert = insert.substring(0, insert.length - 1);
  insert += ';';
  return insert;
}

console.log(genCommands());
console.log('\n\n\n\n\n');
console.log(genLinks());
