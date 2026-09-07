import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Boardgame } from './entities/boardgame.entity';
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

  findById(id: number) {
    return this.boardgames.findOne({ where: { id } });
  }

  findHot(): Promise<Boardgame[]> {
    return this.boardgames.find({ order: { rating: 'DESC' }, take: 5 });
  }
}
