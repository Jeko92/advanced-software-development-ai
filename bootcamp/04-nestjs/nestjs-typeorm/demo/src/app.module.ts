import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.ts';
import { AppService } from './app.service.ts';
import { BoardgamesModule } from './boardgames/boardgames.module.ts';
import { RoomsModule } from './rooms/rooms.module.ts';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env['DB_FILE']!,
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
      enableWAL: true,
      statementCacheSize: 100,
    }),
    BoardgamesModule,
    RoomsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
