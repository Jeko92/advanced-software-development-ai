import { Controller, Get } from '@nestjs/common';
import { BoardgamesService } from './boardgames.service';
import { Boardgame } from './entities/boardgame.entity';

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
