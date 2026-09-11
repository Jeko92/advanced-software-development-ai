import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAuctionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    description: 'Plain number, not a currency-formatted string',
    example: 100,
  })
  @IsNumber()
  @IsPositive()
  startingPrice!: number;

  @ApiPropertyOptional({
    description: 'ISO 8601 date. Defaults to 3 days from creation if omitted.',
    example: '2026-09-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
