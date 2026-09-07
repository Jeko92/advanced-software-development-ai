import { Module } from '@nestjs/common';
import { AppController } from './app.controller.ts';
import { AppService } from './app.service.ts';
import { ThreadsModule } from './threads/threads.module.ts';
import { CommentsModule } from './comments/comments.module.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Thread } from './threads/entities/threads.entity.ts';
import { Comment } from './comments/entities/comments.entity.ts';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env['DB_FILE']!,
      entities: [Thread, Comment],
      synchronize: false,
      logging: false,
      enableWAL: true,
    }),
    ThreadsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
