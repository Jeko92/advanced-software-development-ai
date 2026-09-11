import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOfferDto {
  @ApiProperty({
    description: 'Plain number, not a currency-formatted string',
    example: 150,
  })
  @IsNumber()
  @IsPositive()
  amount!: number;
}
