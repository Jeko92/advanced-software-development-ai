import { Module } from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { ThreadsController } from './threads.controller';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [CommentsModule],
  providers: [ThreadsService],
  controllers: [ThreadsController],
})
export class ThreadsModule {}
