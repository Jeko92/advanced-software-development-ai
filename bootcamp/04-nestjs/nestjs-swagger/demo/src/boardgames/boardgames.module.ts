import { Module } from '@nestjs/common';
import { BoardgamesController } from './boardgames.controller.ts';
import { BoardgamesService } from './boardgames.service.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boardgame } from './entities/boardgame.entity.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Boardgame])],
  controllers: [BoardgamesController],
  providers: [BoardgamesService],
})
export class BoardgamesModule {}
