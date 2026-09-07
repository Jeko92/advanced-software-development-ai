import { Module } from '@nestjs/common';
import { BoardgameController } from './boardgame.controller';
import { BoardgameService } from './boardgame.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boardgame } from './entities/boardgame.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Boardgame])],
  controllers: [BoardgameController],
  providers: [BoardgameService],
})
export class BoardgameModule {}
