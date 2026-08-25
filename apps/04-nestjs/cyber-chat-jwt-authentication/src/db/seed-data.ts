import type { UserRole } from '../users/entities/user.entity.ts';

export interface ThreadSeed {
  title: string;
  body: string;
}

export const THREADS_SEED: ThreadSeed[] = [
  {
    title: 'Best terminal setup for late-night hacking sessions?',
    body: 'Looking for font/theme recommendations that are easy on the eyes at 3am.',
  },
  {
    title: 'Is NestJS overkill for small APIs?',
    body: 'Been using Express for years, curious if the module system is worth the learning curve.',
  },
  {
    title: 'Mechanical keyboards: hot-swap or solder?',
    body: 'About to buy my first custom board and want to future-proof it.',
  },
  {
    title: 'Favorite sci-fi novels about AI gone rogue',
    body: 'Just finished a great one and need something similarly unsettling to read next.',
  },
  {
    title: 'Self-hosting vs cloud: where do you draw the line?',
    body: 'Trying to figure out which services are worth running on my own hardware.',
  },
];

export interface CommentSeed {
  threadIndex: number; // index into THREADS_SEED above
  body: string;
}

export const COMMENTS_SEED: CommentSeed[] = [
  {
    threadIndex: 0,
    body: 'Try a Nerd Font with a low-contrast dark theme, saved my eyes.',
  },
  {
    threadIndex: 0,
    body: 'Also turn your brightness way down, obvious but underrated.',
  },
  {
    threadIndex: 1,
    body: 'Worth it once you have more than 3-4 modules, DI keeps things sane.',
  },
  {
    threadIndex: 1,
    body: 'Agreed, the CLI scaffolding alone saves a lot of boilerplate.',
  },
  {
    threadIndex: 2,
    body: 'Hot-swap every time, you will want to try different switches eventually.',
  },
  {
    threadIndex: 2,
    body: 'Solder is fine if you already know exactly what switches you want long-term.',
  },
  {
    threadIndex: 3,
    body: 'Anything by Ted Chiang scratches that itch for me.',
  },
  {
    threadIndex: 4,
    body: 'I self-host anything I care about being available offline, cloud for the rest.',
  },
];

interface UserSeed {
  username: string;
  password: string;
  roles: UserRole[];
}

export const USERS_SEED: UserSeed[] = [
  {
    username: 'viewer',
    password: 'viewer12345',
    roles: ['viewer'],
  },
  {
    username: 'editor',
    password: 'editor12345',
    roles: ['editor'],
  },
  {
    username: 'admin',
    password: 'admin12345',
    roles: ['admin'],
  },
];
