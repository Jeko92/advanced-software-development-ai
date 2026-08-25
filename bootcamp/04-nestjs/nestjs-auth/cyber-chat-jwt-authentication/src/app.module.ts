import { Module } from '@nestjs/common';
import { AppController } from './app.controller.ts';
import { AppService } from './app.service.ts';
import { ThreadsModule } from './threads/threads.module.ts';
import { CommentsModule } from './comments/comments.module.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module.ts';
import { AppDataSource } from './db/data-source.ts';
import AuthModule from './auth/auth.module.ts';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(AppDataSource.options),
    ThreadsModule,
    CommentsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
