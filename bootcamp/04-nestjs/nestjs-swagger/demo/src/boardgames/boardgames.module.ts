import { Module } from '@nestjs/common';
import { BoardgamesController } from './boardgames.controller';
import { BoardgamesService } from './boardgames.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boardgame } from './entities/boardgame.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Boardgame])],
  controllers: [BoardgamesController],
  providers: [BoardgamesService],
})
export class BoardgamesModule {}
