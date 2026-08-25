// Demo content for `pnpm seed`. IDs are no longer part of this data — Thread/Comment
// primary keys are DB-generated UUIDs now, so comments reference their thread by
// `threadIndex` (position in THREADS_SEED) instead of a hardcoded numeric threadId.

export interface ThreadSeed {
  title: string;
  author: string;
  body: string;
}

export const THREADS_SEED: ThreadSeed[] = [
  {
    title: 'Best terminal setup for late-night hacking sessions?',
    author: 'neon_ghost',
    body: 'Looking for font/theme recommendations that are easy on the eyes at 3am.',
  },
  {
    title: 'Is NestJS overkill for small APIs?',
    author: 'circuit_breaker',
    body: 'Been using Express for years, curious if the module system is worth the learning curve.',
  },
  {
    title: 'Mechanical keyboards: hot-swap or solder?',
    author: 'byte_witch',
    body: 'About to buy my first custom board and want to future-proof it.',
  },
  {
    title: 'Favorite sci-fi novels about AI gone rogue',
    author: 'null_pointer',
    body: 'Just finished a great one and need something similarly unsettling to read next.',
  },
  {
    title: 'Self-hosting vs cloud: where do you draw the line?',
    author: 'signal_jammer',
    body: 'Trying to figure out which services are worth running on my own hardware.',
  },
];

export interface CommentSeed {
  threadIndex: number; // index into THREADS_SEED above
  author: string;
  body: string;
}

export const COMMENTS_SEED: CommentSeed[] = [
  {
    threadIndex: 0,
    author: 'circuit_breaker',
    body: 'Try a Nerd Font with a low-contrast dark theme, saved my eyes.',
  },
  {
    threadIndex: 0,
    author: 'byte_witch',
    body: 'Also turn your brightness way down, obvious but underrated.',
  },
  {
    threadIndex: 1,
    author: 'null_pointer',
    body: 'Worth it once you have more than 3-4 modules, DI keeps things sane.',
  },
  {
    threadIndex: 1,
    author: 'signal_jammer',
    body: 'Agreed, the CLI scaffolding alone saves a lot of boilerplate.',
  },
  {
    threadIndex: 2,
    author: 'neon_ghost',
    body: 'Hot-swap every time, you will want to try different switches eventually.',
  },
  {
    threadIndex: 2,
    author: 'null_pointer',
    body: 'Solder is fine if you already know exactly what switches you want long-term.',
  },
  {
    threadIndex: 3,
    author: 'circuit_breaker',
    body: 'Anything by Ted Chiang scratches that itch for me.',
  },
  {
    threadIndex: 4,
    author: 'byte_witch',
    body: 'I self-host anything I care about being available offline, cloud for the rest.',
  },
];
