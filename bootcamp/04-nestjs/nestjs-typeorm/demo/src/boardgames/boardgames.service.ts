import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Boardgame } from './entities/boardgame.entity.ts';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BoardgamesService {
  constructor(
    @InjectRepository(Boardgame)
    private readonly boardgames: Repository<Boardgame>,
  ) {}

  findAll() {
    return this.boardgames.find();
  }

  findHot(): Promise<Boardgame[]> {
    return this.boardgames.find({ order: { rating: 'DESC' }, take: 5 });
  }
}
