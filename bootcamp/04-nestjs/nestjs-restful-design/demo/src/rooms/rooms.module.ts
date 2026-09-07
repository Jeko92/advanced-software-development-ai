import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boardgame } from '../boardgames/entities/boardgame.entity';
import { Room } from './entities/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Boardgame])],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
