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

export function vu(message: Message) {
  const q = Math.floor(Math.random() * 12);
  if (q === 0) {
    return 'Vu Bad';
  }
  if (q === 1) {
    return 'Vu is an asexual autist.';
  }
  if (q === 2) {
    return 'Vu likes to touch kitty cats.';
  }
  if (q === 3) {
    return 'Vu is uncultured.';
  }
  if (q === 4) {
    return 'Vu suffers from Aspengers.';
  }
  if (q === 5) {
    return 'Vu\'s favorite American artist is Elton John.';
  }
  if (q === 6) {
    return 'Vu uses hard R and sees nothing wrong with it.';
  }
  if (q === 7) {
    return 'Vu does not understand that science is 90% writing. No one cares about discoveries if they cannot be communicated.';
  }
  if (q === 8) {
    return 'Vu\'s disregard for anything outside of science is either completely fake or he is a real life super villain who only cares about "logic" AKA Thanos.';
  }
  if (q === 9) {
    return 'Vu is unsurprisingly tone deaf.';
  }
  if (q === 10) {
    return 'Vu is accredited with damaging my eardrums after his attempt to sing Oprah.';
  }
  if (q === 11) {
    return 'Vu is an active member of the KKK.';
  }
  if (q === 12) {
    return 'Vu has only recently discovered Hot Dogs.';
  }
  return 'It Broken Dood';
}
