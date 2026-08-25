import { Module } from '@nestjs/common';
import { ThreadsService } from './threads.service.ts';
import { ThreadsController } from './threads.controller.ts';
import { CommentsModule } from '../comments/comments.module.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Thread } from './entities/threads.entity.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Thread]), CommentsModule],
  providers: [ThreadsService],
  controllers: [ThreadsController],
})
export class ThreadsModule {}
