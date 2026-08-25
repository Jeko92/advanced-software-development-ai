import { Module } from '@nestjs/common';
import { AppController } from './app.controller.ts';
import { AppService } from './app.service.ts';
import { ThreadsModule } from './threads/threads.module.ts';
import { CommentsModule } from './comments/comments.module.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module.ts';
import { AppDataSource } from './db/data-source.ts';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    ThreadsModule,
    CommentsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
