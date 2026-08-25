export interface Thread {
  id: number;
  title: string;
  author: string;
  body: string;
  createdAt: Date;
}

export const THREADS: Thread[] = [
  {
    id: 1,
    title: 'Best terminal setup for late-night hacking sessions?',
    author: 'neon_ghost',
    body: 'Looking for font/theme recommendations that are easy on the eyes at 3am.',
    createdAt: new Date('2026-08-10T21:12:00Z'),
  },
  {
    id: 2,
    title: 'Is NestJS overkill for small APIs?',
    author: 'circuit_breaker',
    body: 'Been using Express for years, curious if the module system is worth the learning curve.',
    createdAt: new Date('2026-08-12T08:47:00Z'),
  },
  {
    id: 3,
    title: 'Mechanical keyboards: hot-swap or solder?',
    author: 'byte_witch',
    body: 'About to buy my first custom board and want to future-proof it.',
    createdAt: new Date('2026-08-14T15:30:00Z'),
  },
  {
    id: 4,
    title: 'Favorite sci-fi novels about AI gone rogue',
    author: 'null_pointer',
    body: 'Just finished a great one and need something similarly unsettling to read next.',
    createdAt: new Date('2026-08-16T19:05:00Z'),
  },
  {
    id: 5,
    title: 'Self-hosting vs cloud: where do you draw the line?',
    author: 'signal_jammer',
    body: 'Trying to figure out which services are worth running on my own hardware.',
    createdAt: new Date('2026-08-18T11:22:00Z'),
  },
];
