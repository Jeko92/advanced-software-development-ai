import { Expose, Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class AuctionQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: ['open', 'closed'],
    description:
      'Filter by whether the auction is still open (endDate in the future) or closed.',
  })
  @IsOptional()
  @IsIn(['open', 'closed'])
  status?: 'open' | 'closed';

  // Bound from `?seller=` — lets a client list a single seller's auctions
  // (e.g. a "My Auctions" page) without exposing anything not already
  // visible via the public, unfiltered listing.
  @ApiPropertyOptional({
    name: 'seller',
    description: "Filter by the seller (owner)'s user id.",
  })
  @IsOptional()
  @Expose({ name: 'seller' })
  @IsUUID()
  sellerId?: string;

  // Bound from the `?min-price=`/`?max-price=` query params (see README)
  // via @Expose's `name`, so the DTO itself can stay camelCase.
  @ApiPropertyOptional({
    name: 'min-price',
    description: 'Minimum starting price (inclusive).',
    example: 50,
  })
  @IsOptional()
  @Expose({ name: 'min-price' })
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({
    name: 'max-price',
    description: 'Maximum starting price (inclusive).',
    example: 200,
  })
  @IsOptional()
  @Expose({ name: 'max-price' })
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({
    enum: ['ending-soon', 'ending-late'],
    description:
      'Sort by end date. Omit for the default (ending-late, i.e. endDate DESC).',
  })
  @IsOptional()
  @IsIn(['ending-soon', 'ending-late'])
  sort?: 'ending-soon' | 'ending-late';
}
