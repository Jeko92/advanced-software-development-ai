import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user-response.dto.ts';
import { Auction } from '../auction.entity.ts';

/**
 * The client-facing shape of an auction.
 *
 * The entity is never returned directly: it carries the seller's full `User`
 * row (password hash included) and a lazy `offers` relation. Mapping through a
 * response DTO makes the boundary explicit and keeps the two free to diverge.
 */
export class AuctionResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: 'b7d3a9f1-4c2e-4a88-9f01-2d6e5b4c3a10',
  })
  id!: string;

  @ApiProperty({ example: 'Vintage mechanical keyboard' })
  title!: string;

  @ApiProperty({
    example: 'Cherry MX Blue switches, 1987, lightly yellowed keycaps.',
  })
  description!: string;

  @ApiProperty({ description: 'The seller’s opening ask.', example: 49.99 })
  startingPrice!: number;

  @ApiProperty({
    description:
      'Highest accepted bid so far, or the starting price if there are none.',
    example: 62.5,
  })
  currentPrice!: number;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-09-15T18:00:00.000Z',
  })
  endDate!: Date;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-08-29T10:15:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({ type: UserResponseDto })
  seller!: UserResponseDto;

  static fromEntity(auction: Auction): AuctionResponseDto {
    const dto = new AuctionResponseDto();
    dto.id = auction.id;
    dto.title = auction.title;
    dto.description = auction.description;
    dto.startingPrice = auction.startingPrice;
    dto.currentPrice = auction.currentPrice;
    dto.endDate = auction.endDate;
    dto.createdAt = auction.createdAt;
    dto.seller = UserResponseDto.fromEntity(auction.seller);
    return dto;
  }
}
