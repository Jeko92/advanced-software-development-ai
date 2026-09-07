import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Boardgame } from './boardgame/entities/boardgame.entity';
import { BoardgameModule } from './boardgame/boardgame.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BoardgameModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow<string>('DB_HOST'),
        port: parseInt(config.getOrThrow<string>('DB_PORT'), 10),
        username: config.getOrThrow<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD') ?? '',
        database: config.getOrThrow<string>('DB_NAME'),
        entities: [Boardgame],
        synchronize: false,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
