import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateThreadDto {
  @ApiProperty({ maxLength: 150, example: 'Best encryption algorithm?' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @ApiProperty({
    maxLength: 4000,
    example: 'AES-256 vs ChaCha20 — what would you run in production?',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  body!: string;
}
