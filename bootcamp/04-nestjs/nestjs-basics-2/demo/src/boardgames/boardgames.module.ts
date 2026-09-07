import { Module } from '@nestjs/common';
import { BoardgamesController } from './boardgames.controller.ts';
import { BoardgamesService } from './boardgames.service.ts';
import { BoardgamesRepository } from './boardgames.repository.ts';

@Module({
  controllers: [BoardgamesController],
  providers: [BoardgamesRepository, BoardgamesService],
  exports: [BoardgamesRepository],
})
export class BoardgamesModule {}
