import { Module } from '@nestjs/common';
import { ThreadsService } from './threads.service.ts';
import { ThreadsController } from './threads.controller.ts';
import { CommentsModule } from '../comments/comments.module.ts';

@Module({
  imports: [CommentsModule],
  providers: [ThreadsService],
  controllers: [ThreadsController],
})
export class ThreadsModule {}
