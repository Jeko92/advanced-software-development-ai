import type { Comment } from '../../comments/entities/comments.entity.ts';
import { makeUser, USER_ID } from './user.factory.ts';
import { makeThread, THREAD_ID } from './thread.factory.ts';

export const COMMENT_ID = '33333333-3333-4333-8333-333333333333';

export const makeComment = (overrides: Partial<Comment> = {}): Comment => ({
  id: COMMENT_ID,
  threadId: THREAD_ID,
  authorId: USER_ID,
  authorUser: makeUser(),
  thread: makeThread(),
  body: 'Nice thread!',
  createdAt: new Date('2026-01-02T00:00:00.000Z'),
  ...overrides,
});
