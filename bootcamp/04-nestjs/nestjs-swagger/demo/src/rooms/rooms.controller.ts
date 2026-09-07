import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomResponseDto } from './dtos/roomResponse.dto';
import { CreateRoomDto } from './dtos/createRoom.dto';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Room } from './entities/room.entity';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}
  @Get()
  @ApiOkResponse({ type: RoomResponseDto, isArray: true })
  @SerializeOptions({ type: RoomResponseDto })
  findAll(): Promise<Room[]> {
    return this.roomsService.findAll();
  }

  @Post()
  @ApiCreatedResponse({ type: Room })
  createNewRoom(@Body() body: CreateRoomDto): Promise<Room> {
    return this.roomsService.createNewRoom(body.name);
  }

  @Patch(':id/set-game/:gameId')
  @ApiOkResponse({ type: Room })
  @ApiNotFoundResponse({ description: 'No room or game exists with that id' })
  setGame(
    @Param('id') roomId: string,
    @Param('gameId') gameId: string,
  ): Promise<Room> {
    return this.roomsService.setGame(roomId, Number(gameId));
  }
}
