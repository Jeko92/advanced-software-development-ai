import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  SerializeOptions,
} from '@nestjs/common';
import { BoardgamesService } from './boardgames.service.ts';
import { Boardgame } from './entities/boardgame.entity.ts';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { BoardgameResponseDto } from './dtos/boardgameResponse.dto.ts';

@Controller('boardgames')
export class BoardgamesController {
  constructor(private readonly boardgamesService: BoardgamesService) {}

  @Get()
  @ApiOkResponse({ type: BoardgameResponseDto, isArray: true })
  @SerializeOptions({ type: BoardgameResponseDto })
  getAllBoardgames(): Promise<Boardgame[]> {
    return this.boardgamesService.findAll();
  }

  @Get('hot')
  @ApiOkResponse({ type: Boardgame, isArray: true })
  getHotBoardgames(): Promise<Boardgame[]> {
    return this.boardgamesService.findHot();
  }

  @Get(':id')
  @ApiOkResponse({ type: Boardgame })
  @ApiNotFoundResponse({ description: 'No game exists with that id' })
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
