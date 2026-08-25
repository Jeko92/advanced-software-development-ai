import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { CONCERT_GENRES, type ConcertGenre } from '../concert-genres.ts';

export class CreateConcertDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  artist!: string;

  @IsString()
  @IsNotEmpty()
  venue!: string;

  @IsDateString()
  date!: string;

  @IsPositive()
  ticketPrice!: number;

  @IsIn(CONCERT_GENRES)
  genre!: ConcertGenre;
}
