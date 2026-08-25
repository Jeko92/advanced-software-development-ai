import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { CONCERT_GENRES, type ConcertGenre } from '../concert-genres.ts';

export class PaginationQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number = 10;

  @IsOptional()
  @IsIn(['date', '-date'])
  sort?: 'date' | '-date';

  @IsOptional()
  @IsIn(CONCERT_GENRES)
  genre?: ConcertGenre;
}
