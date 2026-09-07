import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service.ts';
import { CommentsController } from './comments.controller.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comments.entity.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
