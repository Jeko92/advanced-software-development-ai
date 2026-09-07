const USER_ID = '11111111-1111-4111-8111-111111111111';
import { User } from '../src/users/user.entity';

export const makeUser = (overrides: Partial<User> = {}): User => ({
  id: USER_ID,
  email: 'seller@darkbay.dev',
  passwordHash: '$2b$10$hash', // absichtlich drin, siehe unten
  auctions: [],
  offers: [],
  createdAt: new Date('2026-08-01T00:00:00.000Z'),
  ...overrides,
});
