import { Controller, Get } from '@nestjs/common';
import { BoardgamesService } from './boardgames.service.ts';

@Controller('boardgames')
export class BoardgamesController {
  constructor(private readonly boardgamesService: BoardgamesService) {}

  @Get()
  getAllBoardgames() {
    return this.boardgamesService.findAll();
  }

  @Get('hot')
  getHotBoardgames() {
    return this.boardgamesService.findHot();
  }
}
