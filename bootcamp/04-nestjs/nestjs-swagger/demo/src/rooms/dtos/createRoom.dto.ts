import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ maxLength: 40, example: 'Friday Game Night' })
  @IsString()
  @MaxLength(40)
  name!: string;
}
