import { Module } from '@nestjs/common';
import { BoardgamesController } from './boardgames.controller';
import { BoardgamesService } from './boardgames.service';
import { BoardgamesRepository } from './boardgames.repository';

@Module({
  controllers: [BoardgamesController],
  providers: [BoardgamesRepository, BoardgamesService],
  exports: [BoardgamesRepository],
})
export class BoardgamesModule {}
