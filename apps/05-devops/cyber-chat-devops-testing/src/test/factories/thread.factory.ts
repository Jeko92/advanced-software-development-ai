import type { Thread } from '../../threads/entities/threads.entity.ts';
import { makeUser, USER_ID } from './user.factory.ts';

export const THREAD_ID = '22222222-2222-4222-8222-222222222222';

export const makeThread = (overrides: Partial<Thread> = {}): Thread => ({
  id: THREAD_ID,
  title: 'Best encryption algorithm?',
  body: 'AES-256 vs ChaCha20 - what would you run in production?',
  authorId: USER_ID,
  authorUser: makeUser(),
  comments: [],
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  ...overrides,
});
