export interface Comment {
  id: number;
  threadId: number;
  author: string;
  body: string;
  createdAt: Date;
}

export const COMMENTS: Comment[] = [
  {
    id: 1,
    threadId: 1,
    author: 'circuit_breaker',
    body: 'Try a Nerd Font with a low-contrast dark theme, saved my eyes.',
    createdAt: new Date('2026-08-10T21:40:00Z'),
  },
  {
    id: 2,
    threadId: 1,
    author: 'byte_witch',
    body: 'Also turn your brightness way down, obvious but underrated.',
    createdAt: new Date('2026-08-10T22:03:00Z'),
  },
  {
    id: 3,
    threadId: 2,
    author: 'null_pointer',
    body: 'Worth it once you have more than 3-4 modules, DI keeps things sane.',
    createdAt: new Date('2026-08-12T09:15:00Z'),
  },
  {
    id: 4,
    threadId: 2,
    author: 'signal_jammer',
    body: 'Agreed, the CLI scaffolding alone saves a lot of boilerplate.',
    createdAt: new Date('2026-08-12T10:02:00Z'),
  },
  {
    id: 5,
    threadId: 3,
    author: 'neon_ghost',
    body: 'Hot-swap every time, you will want to try different switches eventually.',
    createdAt: new Date('2026-08-14T16:10:00Z'),
  },
  {
    id: 6,
    threadId: 3,
    author: 'null_pointer',
    body: 'Solder is fine if you already know exactly what switches you want long-term.',
    createdAt: new Date('2026-08-14T17:45:00Z'),
  },
  {
    id: 7,
    threadId: 4,
    author: 'circuit_breaker',
    body: 'Anything by Ted Chiang scratches that itch for me.',
    createdAt: new Date('2026-08-16T19:40:00Z'),
  },
  {
    id: 8,
    threadId: 5,
    author: 'byte_witch',
    body: 'I self-host anything I care about being available offline, cloud for the rest.',
    createdAt: new Date('2026-08-18T12:01:00Z'),
  },
];
