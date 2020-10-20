import { Message } from 'discord.js';

export function portalCalc(message: Message) {
  const coord = message.content.split(' ');
  const p1 = Number(coord[2]);
  const p2 = Number(coord[3]);
  const p3 = Number(coord[4]);
  const p11 = p1 / 8;
  const p33 = p3 / 8;
  return `${p11} ${p2} ${p33}`;
}

export function roll(message: Message) {
  const base = message.content.split(' ');
  const n = Number(base[2]) + 1;
  const r = Math.floor(Math.random() * n);
  return `${r}`;
}
