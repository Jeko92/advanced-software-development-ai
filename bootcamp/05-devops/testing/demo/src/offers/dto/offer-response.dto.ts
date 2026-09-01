import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user-response.dto.ts';
import { Offer } from '../offer.entity.ts';

/**
 * The client-facing shape of a bid.
 *
 * The entity holds the whole `Auction` row; a bid only needs to say which
 * listing it belongs to, so that relation is flattened to `auctionId`.
 */
export class OfferResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: '9c4e1b02-77aa-4c31-8de5-1f0b3a2c6d94',
  })
  id!: string;

  @ApiProperty({ example: 62.5 })
  amount!: number;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-08-29T11:02:33.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    format: 'uuid',
    example: 'b7d3a9f1-4c2e-4a88-9f01-2d6e5b4c3a10',
  })
  auctionId!: string;

  @ApiProperty({ type: UserResponseDto })
  bidder!: UserResponseDto;

  static fromEntity(offer: Offer): OfferResponseDto {
    const dto = new OfferResponseDto();
    dto.id = offer.id;
    dto.amount = offer.amount;
    dto.createdAt = offer.createdAt;
    // The relation is loaded on some code paths and not on others, so read the
    // id defensively rather than assuming `offer.auction` is there.
    dto.auctionId = offer.auction?.id as string;
    dto.bidder = UserResponseDto.fromEntity(offer.bidder);
    return dto;
  }
}
