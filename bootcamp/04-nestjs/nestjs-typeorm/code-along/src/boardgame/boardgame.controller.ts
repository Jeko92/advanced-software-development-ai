import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BoardgameService } from './boardgame.service';
import { CreateBoardgameDto } from './dto/create-boardgame.dto';
import { UpdatePlaytimeDto } from './dto/update-playtime.dto';
import { BoardgameIdParamDto } from './dto/boardgame-id.param.dto';
import { Boardgame } from './entities/boardgame.entity';

@Controller('boardgame')
export class BoardgameController {
  constructor(private readonly boardgameService: BoardgameService) {}

  @Get()
  findAll(): Promise<Boardgame[]> {
    return this.boardgameService.findAll();
  }

  @Get('search')
  findByName(@Query('name') name: string): Promise<Boardgame[]> {
    return this.boardgameService.findByName(name);
  }

  @Get('quick-games')
  findQuickGames(
    @Query('maxMinutes', ParseIntPipe) maxMinutes: number,
  ): Promise<Boardgame[]> {
    return this.boardgameService.findQuickGames(maxMinutes);
  }

  @Get('average-complexity')
  getAverageComplexity(): Promise<{ average: number }> {
    return this.boardgameService.getAverageComplexity();
  }

  @Get(':id')
  findById(@Param() { id }: BoardgameIdParamDto): Promise<Boardgame> {
    return this.boardgameService.findById(id);
  }

  @Post()
  createGame(@Body() dto: CreateBoardgameDto): Promise<Boardgame> {
    return this.boardgameService.createGame(dto);
  }

  @Patch(':id/playtime')
  updatePlaytime(
    @Param() { id }: BoardgameIdParamDto,
    @Body() { playtimeMinutes }: UpdatePlaytimeDto,
  ): Promise<void> {
    return this.boardgameService.updatePlaytime(id, playtimeMinutes);
  }

  @Delete(':id')
  deleteGame(@Param() { id }: BoardgameIdParamDto): Promise<void> {
    return this.boardgameService.deleteGame(id);
  }
}
