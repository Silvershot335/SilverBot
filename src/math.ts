import { Client, Message } from 'discord.js';

export function portalcalc(message: Message, bot: Client) {
  const coord = message.content.split(' ');
  const p1 = Number(coord[2]);
  const p2 = Number(coord[3]);
  const p3 = Number(coord[4]);
  const p11 = p1 / 8;
  const p33 = p3 / 8;
  return `${p11} ${p2} ${p33}`;
}

export function roll(message: Message, bot: Client) {
  const base = message.content.split (' ');
  const n = Number(base[2]) + 1;
  const r = Math.floor(Math.random() * n);
  return `${r}`;
}

export function tCat(message: Message, bot: Client) {
  const q = Math.floor(Math.random() * 5);
  if (q === 0) {
    return 'Geography 🌍';
  }
  if (q === 1) {
    return 'Entertainment 🖥️';
  }
  if (q === 2) {
    return 'History 🦕';
  }
  if (q === 3) {
    return 'Art and Literature 📖';
  }
  if (q === 4) {
    return 'Science and Nature 🧬';
  }
  if (q === 5) {
    return 'Sports and Leisure ⚾';
  }
  return 'It Broken Dood';
}
