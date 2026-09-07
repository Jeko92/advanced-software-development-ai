import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { RoomsService } from './rooms.service.ts';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}
  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Post()
  createNewRoom() {
    const username = 'Felix';
    return this.roomsService.createNewRoom(username);
  }

  @Patch(':id/set-game/:gameId')
  setGame(@Param('id') roomId: string, @Param('gameId') gameId: string) {
    return this.roomsService.setGame(roomId, gameId);
  }
}
