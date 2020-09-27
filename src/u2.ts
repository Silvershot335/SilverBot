import { Client, Message, TextChannel } from 'discord.js';
import { Connection } from 'typeorm';

function makeBot(connection: Connection) {
    const bot = new Client();
    bot.on('guildMemberAdd', (guildMember) => {
        guildMember.addRole(guildMember.guild.roles.find((role) => role.name === 'New Comer'));
     });
}

export function doStuff(message: Message, bot: Client) {
    if (
        (message.channel as TextChannel).guild.id === '455274725476794368' &&
        message.content.toLowerCase().includes('P123babababa')
       ) {
        message.reply('success');
    }
    if (
        (message.channel as TextChannel).guild.id === '455274725476794368' &&
        message.content.match('123ababababa')
    ) {
        message.reply('placeholder');
    }
    if (
        (message.channel as TextChannel).guild.id === '455274725476794368' &&
        message.content.toLowerCase().match('get on your boots')
        ) {
        message.channel.send('The Future Needs a Big Kiss.');
        message.react('462479805229826058');
      }
}
