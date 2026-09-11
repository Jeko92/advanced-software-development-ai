import { FindOperator, LessThanOrEqual, MoreThan } from 'typeorm';
import { isAuctionOpen } from './utils';

export type AuctionStatus = 'open' | 'closed';

/**
 * Single source of truth for the open/closed boundary (`endDate > now`),
 * shared between the `?status=` filter in AuctionsService.findAll and the
 * derived `status` field on AuctionResponseDto so the two can't drift apart.
 */
export function getAuctionStatus(endDate: Date): AuctionStatus {
  return isAuctionOpen(endDate) ? 'open' : 'closed';
}

/** The `where`-clause operator matching `getAuctionStatus`'s boundary rule. */
export function auctionStatusWhereClause(
  status: AuctionStatus,
): FindOperator<Date> {
  const now = new Date();
  return status === 'open' ? MoreThan(now) : LessThanOrEqual(now);
}
