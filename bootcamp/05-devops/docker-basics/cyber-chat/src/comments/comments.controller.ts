import {
  Controller,
  Delete,
  Get,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import type { CommentResponse } from './dto/CommentResponseDto';
import { AuthGuard } from '@nestjs/passport';
import type { RequestWith } from '../auth/RequestWith';
import type { ValidatedUser } from '../users/entity/user.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CommentResponse> {
    return this.commentsService.getById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Request() request: RequestWith<ValidatedUser>,
  ): Promise<boolean> {
    return this.commentsService.softDelete(id, request.user);
  }
}
