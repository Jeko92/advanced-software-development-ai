import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { BoardgamesService } from './boardgames.service.ts';
import { Boardgame } from './entities/boardgame.entity.ts';

@Controller('boardgames')
export class BoardgamesController {
  constructor(private readonly boardgamesService: BoardgamesService) {}

  @Get()
  getAllBoardgames(): Promise<Boardgame[]> {
    return this.boardgamesService.findAll();
  }

  @Get('hot')
  getHotBoardgames(): Promise<Boardgame[]> {
    return this.boardgamesService.findHot();
  }

  @Get(':id')
  async getBoardgameById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Boardgame> {
    const game = await this.boardgamesService.findById(id);

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    return game;
  }
}
