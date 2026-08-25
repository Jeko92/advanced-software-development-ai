export const CONCERT_GENRES = [
  'rock',
  'jazz',
  'classical',
  'electronic',
  'pop',
] as const;

export type ConcertGenre = (typeof CONCERT_GENRES)[number];
