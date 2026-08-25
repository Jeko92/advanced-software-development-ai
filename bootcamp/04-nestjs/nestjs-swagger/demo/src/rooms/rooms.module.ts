import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller.ts';
import { RoomsService } from './rooms.service.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boardgame } from '../boardgames/entities/boardgame.entity.ts';
import { Room } from './entities/room.entity.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Boardgame])],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
