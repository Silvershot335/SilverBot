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

export function triviaCategories(message: Message, bot: Client) {
  const q = Math.floor(Math.random() * 5);
  if (q === 0) {
    message.channel.send('Geography');
  }
  if (q === 1) {
    message.channel.send('Entertainment');
  }
  if (q === 2) {
    message.channel.send('History');
  }
  if (q === 3) {
    message.channel.send('Art and Literature');
  }
  if (q === 4) {
    message.channel.send('Science and Nature');
  }
  if (q === 5) {
    message.channel.send('Sports and Leisure');
  }
  return '🎲';
}
