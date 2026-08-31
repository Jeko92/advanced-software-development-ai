import type { User } from '../../users/entities/user.entity.ts';

export const USER_ID = '11111111-1111-4111-8111-111111111111';

export const makeUser = (overrides: Partial<User> = {}): User => ({
  id: USER_ID,
  username: 'alice',
  passwordHash: '$2b$12$examplehashedpasswordvalue',
  roles: ['viewer'],
  ...overrides,
});
