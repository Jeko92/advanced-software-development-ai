import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity.ts';
import { Repository } from 'typeorm';
import { Boardgame } from '../boardgames/entities/boardgame.entity.ts';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly rooms: Repository<Room>,
    @InjectRepository(Boardgame)
    private readonly boardgames: Repository<Boardgame>,
  ) {}

  findAll() {
    return this.rooms.find({ relations: { game: true } });
  }

  createNewRoom(owner: string) {
    return this.rooms.save({
      date: new Date(),
      players: [owner],
    });
  }

  async setGame(roomId: string, gameId: number) {
    // get current room
    const currentRoom = await this.rooms.findOneBy({ id: roomId });
    if (!currentRoom) {
      throw new NotFoundException('Room not found');
    }
    // get the game data
    const game = await this.boardgames.findOneBy({ id: gameId });
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    // insert the game into the room and return the updated data
    return this.rooms.update(roomId, { game });
  }
}
