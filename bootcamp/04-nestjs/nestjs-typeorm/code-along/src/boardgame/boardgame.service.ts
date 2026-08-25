import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Boardgame } from './entities/boardgame.entity.ts';
import { LessThanOrEqual, Like, Repository } from 'typeorm';
import type { CreateBoardgameDto } from './dto/create-boardgame.dto.ts';

@Injectable()
export class BoardgameService {
  constructor(
    @InjectRepository(Boardgame)
    private readonly boardgames: Repository<Boardgame>,
  ) {}

  async findAll(): Promise<Boardgame[]> {
    return this.boardgames.find({
      order: { name: 'ASC' },
    });
  }

  async findByName(name: string): Promise<Boardgame[]> {
    return this.boardgames.find({
      where: { name: Like(`%${name}%`) },
    });
  }

  async findById(id: string): Promise<Boardgame> {
    const game = await this.boardgames.findOneBy({ id });

    if (!game) {
      throw new NotFoundException(`Boardgame with ID ${id} not found`);
    }
    return game;
  }

  async findQuickGames(maxMinutes: number): Promise<Boardgame[]> {
    return this.boardgames.find({
      where: { playtimeMinutes: LessThanOrEqual(maxMinutes) },
    });
  }

  async createGame(dto: CreateBoardgameDto): Promise<Boardgame> {
    const boardgame = this.boardgames.create(dto);

    return this.boardgames.save(boardgame);
  }

  async updatePlaytime(id: string, newTime: number): Promise<void> {
    await this.boardgames.update(id, { playtimeMinutes: newTime });
  }

  async deleteGame(id: string): Promise<void> {
    await this.boardgames.delete(id);
  }

  async getAverageComplexity(): Promise<{ average: number }> {
    const result = await this.boardgames
      .createQueryBuilder('bg')
      .select('AVG(bg.complexity)', 'average')
      .getRawOne<{ average: string | null }>();

    return { average: result?.average ? parseFloat(result.average) : 0 };
  }
}
