import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardgamesModule } from './boardgames/boardgames.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [BoardgamesModule, RoomsModule],
})
export class AppModule {}
