import { Controller, Get } from '@nestjs/common';
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
}
