import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Request,
} from '@nestjs/common';
import { CommentsService } from './comments.service.ts';
import { CommentResponseDto } from './dto/comment-response.dto.ts';
import { UpdateCommentDto } from './dto/update-comment.dto.ts';
import type { RequestWithUser } from '../common/types/request-with-user.ts';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id')
  async getOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CommentResponseDto> {
    const comment = await this.commentsService.getCommentById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return comment;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCommentDto,
    @Request() req: RequestWithUser,
  ): Promise<CommentResponseDto> {
    const comment = await this.commentsService.updateComment(
      id,
      dto,
      req.user.id,
      req.user.roles,
    );
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return comment;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: RequestWithUser,
  ): Promise<void> {
    const removed = await this.commentsService.deleteComment(
      id,
      req.user.id,
      req.user.roles,
    );
    if (!removed) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
  }
}
