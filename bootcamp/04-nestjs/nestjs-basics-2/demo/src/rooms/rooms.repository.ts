import { Injectable } from '@nestjs/common';
import type { BoardGame } from '../data.ts';

type Room = {
  id: string;
  players: string[];
  game: BoardGame | null;
};

@Injectable()
export class RoomsRepository {
  private rooms: Room[] = [];
  findAll() {
    return this.rooms;
  }

  findById(id: string) {
    return this.rooms.find((room) => room.id === id);
  }

  create(newRoom: Room) {
    this.rooms.push(newRoom);
    return newRoom;
  }

  update(id: string, updatedRoom: Room) {
    this.rooms = this.rooms.map((room) => {
      if (room.id === id) {
        return updatedRoom;
      }
      return room;
    });

    return updatedRoom;
  }
}
