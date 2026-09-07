import { Injectable, NotFoundException } from '@nestjs/common';
import { RoomsRepository } from './rooms.repository.ts';
import { BoardgamesRepository } from '../boardgames/boardgames.repository.ts';

@Injectable()
export class RoomsService {
  constructor(
    private readonly roomsRepository: RoomsRepository,
    private readonly boardGamesRepository: BoardgamesRepository,
  ) {}

  findAll() {
    return this.roomsRepository.findAll();
  }

  createNewRoom(owner: string) {
    const room = {
      id: crypto.randomUUID(),
      players: [owner],
      game: null,
    };
    this.roomsRepository.create(room);
    return room;
  }

  setGame(roomId: string, gameId: string) {
    // get current room
    const currentRoom = this.roomsRepository.findById(roomId);
    if (!currentRoom) {
      throw new NotFoundException('Room not found');
    }

    // get the game data
    const game = this.boardGamesRepository.findById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    // insert the game into the room
    const updatedRoom = {
      ...currentRoom,
      game,
    };

    // update the room
    // return the updated data
    return this.roomsRepository.update(roomId, updatedRoom);
  }
}
