import { Expose, Type } from 'class-transformer';

export class ConcertResponseDto {
  @Expose()
  id!: string;

  @Expose()
  title!: string;

  @Expose()
  artist!: string;

  @Expose()
  venue!: string;

  @Expose()
  @Type(() => Date)
  date!: Date;

  @Expose()
  ticketPrice!: number;

  @Expose()
  genre!: string;
}
