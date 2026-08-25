import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BoardgameResponseDto {
  @ApiProperty({
    type: String,
    description: "The boardgame's ID",
    example: '1',
  })
  @Expose()
  id!: string;

  @ApiProperty()
  @Expose()
  title!: string;

  @ApiProperty()
  @Expose()
  minPlayers!: number;

  @ApiProperty()
  @Expose()
  maxPlayers!: number;

  @ApiProperty()
  @Expose()
  playTimeMinutes!: number;

  @ApiProperty()
  @Expose()
  minAge!: number;

  @ApiProperty()
  @Expose()
  complexity!: number;

  @ApiProperty()
  @Expose()
  rating!: number;

  @ApiProperty({ type: [String] })
  @Expose()
  categories!: string[];

  @ApiProperty()
  @Expose()
  available!: boolean;
}
