import { Expose, Type } from 'class-transformer';
import { BoardgameResponseDto } from '../../boardgames/dtos/boardgameResponse.dto';

export class RoomResponseDto {
  @Expose()
  id!: string;

  @Expose()
  date!: Date;

  @Expose()
  @Type(() => BoardgameResponseDto)
  game!: BoardgameResponseDto | null;

  @Expose()
  players!: string[];
}
