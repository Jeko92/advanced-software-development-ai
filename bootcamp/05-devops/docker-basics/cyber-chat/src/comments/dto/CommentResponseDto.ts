import { Expose, Type } from 'class-transformer';

export class CommentResponse {
  @Expose()
  id!: number;

  @Expose()
  threadId!: number;

  @Expose()
  author!: string;

  @Expose()
  body!: string;

  @Expose()
  @Type(() => Date)
  createdAt!: Date;
}
