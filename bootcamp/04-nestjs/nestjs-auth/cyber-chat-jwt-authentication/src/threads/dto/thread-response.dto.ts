import { Expose, Type } from 'class-transformer';

export class ThreadResponseDto {
  @Expose()
  id!: string;

  @Expose()
  title!: string;

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
