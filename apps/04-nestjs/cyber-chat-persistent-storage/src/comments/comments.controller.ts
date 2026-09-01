import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { type Comment } from './entities/comments.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Comment> {
    const comment = await this.commentsService.getCommentById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return comment;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ deleted: true }> {
    const removed = await this.commentsService.deleteComment(id);
    if (!removed) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return { deleted: true };
  }
}
