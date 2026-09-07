import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { AuctionStatus } from '../auction-status.enum';
import type { AuctionQuery } from '../auction-query.type';

/**
 * Filters for `GET /auctions`, on top of the inherited `page` and `limit`.
 *
 * The price filters are spelled `min-price` / `max-price` on the wire, which is
 * not a legal TypeScript identifier. `@Expose({ name })` bridges the two: the
 * hyphenated query key is mapped onto the camelCase property before validation,
 * so `forbidNonWhitelisted` sees a known field rather than a stray one.
 */
export class QueryAuctionsDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description:
      'Only auctions that are still open, or only those that have ended.',
    enum: AuctionStatus,
    example: AuctionStatus.Open,
  })
  @IsOptional()
  @IsEnum(AuctionStatus)
  status?: AuctionStatus;

  @ApiPropertyOptional({
    name: 'min-price',
    description: 'Lowest current price to include.',
    minimum: 0,
    example: 10,
  })
  @Expose({ name: 'min-price' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    name: 'max-price',
    description: 'Highest current price to include.',
    minimum: 0,
    example: 500,
  })
  @Expose({ name: 'max-price' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  /**
   * Hands the service just the filters, stripped of everything HTTP.
   *
   * The pagination half of this DTO travels separately, as a `PageRequest`
   * from `toPageRequest()`.
   */
  toAuctionQuery(): AuctionQuery {
    const query: AuctionQuery = {};
    if (this.status !== undefined) query.status = this.status;
    if (this.minPrice !== undefined) query.minPrice = this.minPrice;
    if (this.maxPrice !== undefined) query.maxPrice = this.maxPrice;
    return query;
  }
}
