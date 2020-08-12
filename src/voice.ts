import { Client, Message, StreamDispatcher } from 'discord.js';
import fs from 'fs';
import http from 'https';
import { FormattedInput } from './input';
import { logger } from './logger';

let voiceConnection: StreamDispatcher | null = null;

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

  if (message.content.toLowerCase().trim() === '\'') {
    const winner = message.guild.member;
    const VC = message.member.voiceChannel;
    message.reply('You win!');
    if (!VC) {
      message.reply('You Are Not In Voice Channel');
    } else {
      VC.join()
        .then((connection) => {
          const play = connection.playFile(
            'C:\\Users\\silve\\Documents\\GitHub\\SilverBot\\Audio\\buzz.mp3'
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

/**
 * This function takes the uploaded file and  downloads it to the Audio directory. If
 * a extra word is passed, it will use that for the file name instead of the original file name.
 * On saving, it replaces spaces with _ characters.
 */
export function uploadSong(input: FormattedInput, message: Message) {
  if (message.attachments.array().length) {
    for (const item of message.attachments.array()) {
      if (item.url && item.url.endsWith('.mp3')) {
        let fileName: string;
        if (input.key) {
          fileName = input.key + '.mp3';
        } else {
          fileName = item.url
            .substring(item.url.lastIndexOf('/') + 1)
            .toLowerCase()
            .replace(/\s+/g, '_');
        }
        const file = fs.createWriteStream(`Audio/${fileName}`);
        http.get(item.url, (response) => response.pipe(file));
      }
    }
  }
}

/**
 * This function will stop the music and disconnect from voice
 */
export function stopPlayingSong(bot: Client) {
  if (voiceConnection) {
    voiceConnection.pause();
  }
  bot.voiceConnections.forEach((connection) => connection.disconnect());
}

/**
 * This function looks in the directory for the song in the input, replacing
 * spaces with _ to properly search.
 */
export function playSong(input: FormattedInput, message: Message) {
  const vc = message.member.voiceChannel;
  if (!vc) {
    message.reply('You are not in a voice channel');
  } else {
    const fileName = `Audio/${input.all
      .replace(/\s+/g, '_')
      .toLowerCase()}.mp3`;
    if (fs.existsSync(fileName)) {
      vc.join().then((conn) => {
        try {
          const play = conn.playFile(fileName);
          play.on('end', () => (voiceConnection = null));
          voiceConnection = play;
        } catch (e) {
          logger.error(e);
        }
      });
    }
  }
}
