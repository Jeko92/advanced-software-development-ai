import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinDate,
} from 'class-validator';

/**
 * What a client is allowed to send when listing an item.
 *
 * Everything the server owns is absent by design: `id`, `createdAt`,
 * `currentPrice` (seeded from `startingPrice`) and `seller` (taken from the
 * verified token). With `forbidNonWhitelisted` switched on globally, sending
 * any of them is a 400 rather than a silent no-op — a client cannot talk its
 * way into owning someone else's listing.
 */
export class CreateAuctionDto {
  @ApiProperty({
    description: 'Short headline for the listing.',
    maxLength: 120,
    example: 'Vintage mechanical keyboard',
  })
  @IsString()
  @MaxLength(120)
  title!: string;

  @ApiProperty({
    description: 'Condition, provenance, whatever a bidder needs to know.',
    example: 'Cherry MX Blue switches, 1987, lightly yellowed keycaps.',
  })
  @IsString()
  @MaxLength(5000)
  description!: string;

  @ApiProperty({
    description: 'Opening ask. The first bid must exceed this amount.',
    minimum: 0.01,
    example: 49.99,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  startingPrice!: number;

  @ApiPropertyOptional({
    description:
      'When bidding closes, as an ISO 8601 timestamp. Defaults to three days from now.',
    type: String,
    format: 'date-time',
    example: '2026-09-15T18:00:00.000Z',
  })
  @IsOptional()
  // JSON has no date type, so the value arrives as a string. `@Type` parses it
  // into a real Date before `@IsDate` and `@MinDate` can judge it.
  @Type(() => Date)
  @IsDate()
  @MinDate(() => new Date(), { message: 'endDate must be in the future' })
  endDate?: Date;
}
