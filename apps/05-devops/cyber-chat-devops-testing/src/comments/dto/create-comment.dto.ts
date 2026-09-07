import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ maxLength: 2000, example: 'ChaCha20, no contest.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  body!: string;
}
