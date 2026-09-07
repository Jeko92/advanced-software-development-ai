import { Module } from '@nestjs/common';
import { BoardgamesModule } from './boardgames/boardgames.module.ts';
import { RoomsModule } from './rooms/rooms.module.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Boardgame } from './boardgames/entities/boardgame.entity.ts';
import { Room } from './rooms/entities/room.entity.ts';
import { AppController } from './app.controller.ts';
import { AppService } from './app.service.ts';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'better-sqlite3',
        database: config.getOrThrow<string>('DB_FILE'),
        entities: [Boardgame, Room],
        synchronize: true,
        logging: true,
        enableWAL: true,
        statementCacheSize: 100,
      }),
    }),
    BoardgamesModule,
    RoomsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
