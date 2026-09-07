import { Injectable } from '@nestjs/common';
import { boardGames } from '../data.ts';

@Injectable()
export class BoardgamesRepository {
  private games = boardGames;
  findAll() {
    return this.games;
  }

  findById(id: string) {
    return this.games.find((game) => game.id === id);
  }
}
