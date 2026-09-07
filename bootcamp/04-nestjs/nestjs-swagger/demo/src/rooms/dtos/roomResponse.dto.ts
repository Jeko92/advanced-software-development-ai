import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BoardgameResponseDto } from '../../boardgames/dtos/boardgameResponse.dto.ts';

export class RoomResponseDto {
  @ApiProperty({ format: 'uuid' })
  @Expose()
  id!: string;

  @ApiProperty()
  @Expose()
  date!: Date;

  @ApiProperty({ type: () => BoardgameResponseDto, nullable: true })
  @Expose()
  @Type(() => BoardgameResponseDto)
  game!: BoardgameResponseDto | null;

  @ApiProperty({ type: [String] })
  @Expose()
  players!: string[];
}
