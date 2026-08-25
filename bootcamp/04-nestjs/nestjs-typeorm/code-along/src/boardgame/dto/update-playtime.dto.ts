import { IsInt, IsPositive } from 'class-validator';

export class UpdatePlaytimeDto {
  @IsInt()
  @IsPositive()
  playtimeMinutes!: number;
}
