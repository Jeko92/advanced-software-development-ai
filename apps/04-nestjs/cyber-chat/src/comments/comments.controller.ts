import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { CommentsService } from './comments.service.ts';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id')
  getOne(@Param('id') id: string) {
    const comment = this.commentsService.getCommentById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return comment;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const removed = this.commentsService.deleteComment(id);
    if (!removed) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return { deleted: true };
  }
}
