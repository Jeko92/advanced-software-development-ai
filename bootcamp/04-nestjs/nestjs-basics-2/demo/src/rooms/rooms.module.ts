import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller.ts';
import { RoomsService } from './rooms.service.ts';
import { RoomsRepository } from './rooms.repository.ts';
import { BoardgamesModule } from '../boardgames/boardgames.module.ts';

@Module({
  imports: [BoardgamesModule],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsRepository],
})
export class RoomsModule {}
