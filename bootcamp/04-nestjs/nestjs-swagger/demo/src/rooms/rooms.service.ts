import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { Boardgame } from '../boardgames/entities/boardgame.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly rooms: Repository<Room>,
    @InjectRepository(Boardgame)
    private readonly boardgames: Repository<Boardgame>,
  ) {}

  findAll(): Promise<Room[]> {
    return this.rooms.find({ relations: { game: true } });
  }

  createNewRoom(owner: string) {
    return this.rooms.save({
      date: new Date(),
      players: [owner],
    });
  }

  async setGame(roomId: string, gameId: number) {
    const room = await this.rooms.findOne({
      where: { id: roomId },
      relations: { game: true },
    });
    if (!room) throw new NotFoundException('Room not found');

    const game = await this.boardgames.findOneBy({ id: gameId });
    if (!game) throw new NotFoundException('Game not found');

    const updatedRoom = {
      ...room,
      game,
    };
    return this.rooms.save(updatedRoom);
  }
}
