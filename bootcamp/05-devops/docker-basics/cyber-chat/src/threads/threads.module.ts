import { Module } from '@nestjs/common';
import { ThreadsController } from './threads.controller';
import { ThreadsService } from './threads.service';
import { CommentsModule } from '../comments/comments.module';
import { Thread } from './entity/thread.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../comments/entity/comment.entity';

@Module({
  imports: [CommentsModule, TypeOrmModule.forFeature([Thread, Comment])],
  controllers: [ThreadsController],
  providers: [ThreadsService],
})
export class ThreadsModule {}
