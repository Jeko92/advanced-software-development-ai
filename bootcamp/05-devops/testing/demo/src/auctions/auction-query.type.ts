import { AuctionStatus } from './auction-status.enum';

/**
 * The filters `AuctionsService.findAll` understands.
 *
 * Every field is optional: an absent filter means "do not narrow the list".
 * This is a plain type rather than the request DTO, so the service knows
 * nothing about query strings, validation or Swagger.
 */
export type AuctionQuery = {
  status?: AuctionStatus;
  minPrice?: number;
  maxPrice?: number;
};
