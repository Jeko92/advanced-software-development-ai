import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

/**
 * A bid carries nothing but an amount.
 *
 * There is deliberately no `bidder` field: identity comes from the verified
 * token. There is no `auctionId` either — that is in the route path, and a
 * value that appears in two places can disagree with itself.
 */
export class CreateOfferDto {
  @ApiProperty({
    description:
      'Bid amount. Must strictly exceed the auction’s current price.',
    minimum: 0.01,
    example: 62.5,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount!: number;
}
