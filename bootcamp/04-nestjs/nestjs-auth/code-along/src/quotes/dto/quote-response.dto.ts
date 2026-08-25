import { Expose } from 'class-transformer';

export class QuoteResponseDto {
  @Expose()
  id!: string;

  @Expose()
  quote!: string;

  @Expose()
  author!: string;
}
