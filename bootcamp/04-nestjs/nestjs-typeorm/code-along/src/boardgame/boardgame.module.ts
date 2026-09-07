import { Module } from '@nestjs/common';
import { BoardgameController } from './boardgame.controller.ts';
import { BoardgameService } from './boardgame.service.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boardgame } from './entities/boardgame.entity.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Boardgame])],
  controllers: [BoardgameController],
  providers: [BoardgameService],
})
export class BoardgameModule {}
