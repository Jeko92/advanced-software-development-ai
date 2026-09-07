import { Module } from '@nestjs/common';
import { AppController } from './app.controller.ts';
import { AppService } from './app.service.ts';
import { BoardgamesModule } from './boardgames/boardgames.module.ts';
import { RoomsModule } from './rooms/rooms.module.ts';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [BoardgamesModule, RoomsModule],
})
export class AppModule {}
