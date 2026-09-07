import { Injectable } from '@nestjs/common';
import { BoardgamesRepository } from './boardgames.repository.ts';

@Injectable()
export class BoardgamesService {
  constructor(private readonly boardgamesRepository: BoardgamesRepository) {}

  findAll() {
    return this.boardgamesRepository.findAll();
  }

  findHot() {
    const allGames = this.boardgamesRepository.findAll();
    const top5Games = allGames
      .toSorted((a, b) => b.rating - a.rating)
      .slice(0, 5);

    return top5Games;
  }
}

// find the 5 most popular games
