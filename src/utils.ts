import { RichEmbed } from 'discord.js';

export const functions = [
  'aesthetic',
  'alt',
  'store',
  'link',
  'links',
  'commands',
  'meme',
  'help',
  'mchelp',
  'info',
  'skip',
  'level',
  'add-levels',
  'portal',
  'play',
  'stop',
  'upload',
  'q',
  'roll',
  'trivia',
  'playlist-club',
  'vu',
  'ah',
];

export const songs: { title: string; duration: number }[] = [
  // Mini Mix Vol 1
  { title: 'Afternoon in Heaven', duration: 103 },
  { title: 'El Dorado', duration: 107 },
  { title: 'Turning off the Rain', duration: 97 },
  { title: 'U Wanna Dance?', duration: 143 },
  { title: 'Nothing Baby', duration: 119 },
  { title: 'Mine', duration: 141 },
  // Singles
  { title: 'Airplane', duration: 225 },
  { title: 'How to Get Physical', duration: 190 },
  { title: 'Oh Hell', duration: 208 },
  { title: 'Killshot', duration: 236 },
  { title: 'Good Intentions', duration: 216 },
  { title: 'Venice', duration: 196 },
  { title: 'Only If You Want It', duration: 215 },
  { title: 'Money Lover', duration: 191 },
  { title: 'Ghost', duration: 186 },
  { title: 'The Girls', duration: 216 },
  { title: 'Story', duration: 230 },
  { title: 'Stop & Go', duration: 180 },
  { title: 'Live 4ever', duration: 203 },
  { title: 'Woww', duration: 120 },

  // Night/Pop
  { title: 'Neon', duration: 153 },
  { title: 'Drive Alone', duration: 240 },
  { title: 'Redbone', duration: 256 },
  { title: 'Move Slow', duration: 242 },
  // Day/Pop
  { title: 'Waking Up', duration: 217 },
  { title: 'Set Me Off', duration: 206 },
  { title: 'Head Over Heels', duration: 213 },
  { title: '#wastehistime', duration: 216 },
  // Extra
  { title: 'VOCPOP', duration: 185 },
  { title: 'Crimson', duration: 200 },
];

export const infoMessageEmbed = new RichEmbed().setColor('#0099ff');

export const username = process.env.API_USER!;
export const password = process.env.API_PASS!;

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomItem<T>(array: T[]): T {
  return array[getRandomNumber(0, array.length - 1)];
}

export function getNow() {
  const date = new Date();
  return (
    date.toLocaleDateString() + ' ' + date.getHours() + ':' + date.getMinutes()
  );
}

export function titleCase(word: string) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

export function shuffle<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
