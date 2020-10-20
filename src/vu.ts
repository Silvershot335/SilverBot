import { getRandomItem } from './utils';

const commands: string[] = [
  'Vu Bad',
  'Vu is an asexual autist.',
  'Vu likes to touch kitty cats.',
  'Vu is uncultured.',
  'Vu suffers from Aspengers.',
  "Vu's favorite American artist is Elton John.",
  'Vu uses hard R and sees nothing wrong with it.',
  'Vu does not understand that science is 90% writing. ' +
    'No one cares about discoveries if they cannot be communicated.',
  "Vu's disregard for anything outside of science is either completely " +
    'fake or he is a real life super villain who only cares about "logic" AKA Thanos.',
  'Vu is unsurprisingly tone deaf.',
  'Vu is accredited with damaging my eardrums after his attempt to sing Oprah.',
  'Vu is an active member of the KKK.',
  'Vu has only recently discovered Hot Dogs.',
];

export function vu(): string {
  return getRandomItem(commands);
}
