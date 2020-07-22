import { Client, Message } from 'discord.js';
import { logger } from './logger';

export function checkVoiceCommands(message: Message, bot: Client) {
  if (message.content.toLowerCase().trim() === 'litrightnow') {
    const VC = message.member.voiceChannel;
    if (!VC) {
      message.reply('You Are Not In Voice Channel');
    } else {
      VC.join()
        .then((connection) => {
          const play = connection.playFile(
            'C:\\Users\\silve\\Documents\\GitHub\\SilverBot\\Audio\\LitRightNow.mp3'
          );
          play.on('end', () => {
            connection.disconnect();
          });
        })
        .catch(logger.error);
    }
  }

  if (message.content.toLowerCase().trim() === 'seashanty2') {
    const VC = message.member.voiceChannel;
    if (!VC) {
      message.reply('You Are Not In Voice Channel');
    } else {
      VC.join()
        .then((connection) => {
          const play = connection.playFile(
            'C:\\Users\\silve\\Documents\\GitHub\\SilverBot\\Audio\\SeaShanty2.mp3'
          );
          play.on('end', () => {
            connection.disconnect();
          });
        })
        .catch(logger.error);
    }
  }

  if (message.content.toLowerCase().trim() === 'leavevc') {
    bot.voiceConnections.forEach((connection) => connection.disconnect());
  }
}
