import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateBoardgameDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name!: string;

  @IsInt()
  @IsPositive()
  minPlayers!: number;

  @IsInt()
  @IsPositive()
  maxPlayers!: number;

  @IsPositive()
  playtimeMinutes!: number;

  @IsPositive()
  complexity!: number;
}
