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

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}
  @Get()
  @SerializeOptions({ type: RoomResponseDto })
  findAll() {
    return this.roomsService.findAll();
  }

  @Post()
  createNewRoom(@Body() body: CreateRoomDto) {
    return this.roomsService.createNewRoom(body.name);
  }

  @Patch(':id/set-game/:gameId')
  setGame(@Param('id') roomId: string, @Param('gameId') gameId: string) {
    return this.roomsService.setGame(roomId, Number(gameId));
  }
}
