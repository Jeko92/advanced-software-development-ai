import { Auction } from '../src/auctions/auction.entity.ts';
import { makeUser } from './user.factory.ts';

export const SELLER_ID = '11111111-1111-4111-8111-111111111111';
export const AUCTION_ID = '22222222-2222-4222-8222-222222222222';

export const makeAuction = (overrides: Partial<Auction> = {}): Auction => ({
  id: AUCTION_ID,
  title: 'Vintage mechanical keyboard',
  description: 'Cherry MX Blue switches, 1987, lightly yellowed keycaps.',
  startingPrice: 49.99,
  currentPrice: 49.99,
  endDate: new Date('2026-09-15T18:00:00.000Z'),
  createdAt: new Date('2026-08-31T10:13:18.000Z'),
  seller: makeUser(),
  offers: [],
  ...overrides,
});
