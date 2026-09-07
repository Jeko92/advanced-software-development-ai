import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service.ts';
import { CommentsController } from './comments.controller.ts';

@Module({
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService],
})
export class CommentsModule {}
