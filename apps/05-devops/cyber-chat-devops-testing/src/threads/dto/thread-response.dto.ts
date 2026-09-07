import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ThreadResponseDto {
  @ApiProperty({ format: 'uuid' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'Best encryption algorithm?' })
  @Expose()
  title!: string;

  @ApiProperty({
    example: 'AES-256 vs ChaCha20 — what would you run in production?',
  })
  @Expose()
  body!: string;

  @ApiProperty({ format: 'uuid' })
  @Expose()
  authorId!: string;

  @ApiProperty({ example: 'admin' })
  @Expose()
  author!: string;

  @ApiProperty({ format: 'date-time' })
  @Expose()
  @Type(() => Date)
  createdAt!: Date;
}
