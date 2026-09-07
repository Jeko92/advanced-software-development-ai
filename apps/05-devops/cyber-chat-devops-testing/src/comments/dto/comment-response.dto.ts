import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CommentResponseDto {
  @ApiProperty({ format: 'uuid' })
  @Expose()
  id!: string;

  @ApiProperty({ format: 'uuid' })
  @Expose()
  threadId!: string;

  @ApiProperty({ example: 'ChaCha20, no contest.' })
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
