import { Client } from 'discord.js';
import { songs } from './utils';

let songTimeOut: NodeJS.Timeout;

function getSong() {
  return songs[Math.floor(Math.random() * songs.length)];
}
export function pickSong(songTitle?: string) {
  let song = getSong();
  while (song.title === songTitle) {
    song = getSong();
  }
  return song;
}

export function findSongDuration(songTitle: string) {
  return songs.find((song) => song.title === songTitle)?.duration || 60;
}

export function playSong(
  bot: Client,
  songTitle?: string,
  songDuration?: number
) {
  // if we gave it a song
  if (songTitle) {
    // Change playing song right now to the song given
    bot.user.setPresence({ game: { name: songTitle } });

    // Find how long the song is
    // if song duration is set, use that value
    // otherwise, do a lookup to find the song's length
    const duration = songDuration || findSongDuration(songTitle);

    // in the song's duration amount of seconds, change songs
    songTimeOut = setTimeout(() => {
      playSong(bot);
    }, duration * 1000);
  } else {
    // Otherwise, we don't have a specific song we wanna play
    // Pick a random song
    const song = pickSong();
    // Change playing song right now to the random song
    bot.user.setPresence({ game: { name: song.title } });
    // in the song's duration amount of seconds, change songs by calling this function again
    songTimeOut = setTimeout(() => {
      playSong(bot);
    }, song.duration * 1000);
  }
}

export function skipSong(bot: Client) {
  // stop the queue of songs
  clearTimeout(songTimeOut);
  // pick a random song that is not the current one
  const nextSong = pickSong(bot.user.presence.game.name);
  // and play it
  playSong(bot, nextSong.title, nextSong.duration);
}
