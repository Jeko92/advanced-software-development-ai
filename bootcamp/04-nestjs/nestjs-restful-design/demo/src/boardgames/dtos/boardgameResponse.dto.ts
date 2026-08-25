import { Expose } from 'class-transformer';

export class BoardgameResponseDto {
  @Expose()
  id!: string;
  @Expose()
  title!: string;
  @Expose()
  minPlayers!: number;
  @Expose()
  maxPlayers!: number;
  @Expose()
  playTimeMinutes!: number;
  @Expose()
  minAge!: number;
  @Expose()
  complexity!: number;
  @Expose()
  rating!: number;
  @Expose()
  categories!: string[];
  @Expose()
  available!: boolean;
}
