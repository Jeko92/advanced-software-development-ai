import { Expose, Type } from 'class-transformer';

export class CommentResponseDto {
  @Expose()
  id!: string;

  @Expose()
  threadId!: string;

  @Expose()
  body!: string;

  @Expose()
  authorId!: string;

  @Expose()
  author!: string;

  @Expose()
  @Type(() => Date)
  createdAt!: Date;
}
