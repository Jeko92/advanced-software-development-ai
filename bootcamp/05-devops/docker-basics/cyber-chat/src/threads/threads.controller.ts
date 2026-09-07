import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { CommentsService } from '../comments/comments.service';
import { CreateCommentDto } from '../comments/dto/CreateCommentDto';
import { CommentResponse } from '../comments/dto/CommentResponseDto';
import { ThreadResponseDto } from './dto/ThreadResponseDto';
import { ThreadWithCommentsResponseDto } from './dto/ThreadWithCommentsResponseDto';
import { CreateThreadDto } from './dto/CreateThreadDto';
import { AuthGuard } from '@nestjs/passport';
import type { RequestWith } from '../auth/RequestWith';
import type { ValidatedUser } from '../users/entity/user.entity';

@Controller('threads')
export class ThreadsController {
  constructor(
    private readonly threadsService: ThreadsService,
    private readonly commentsService: CommentsService,
  ) {}

  @Get('/')
  async getAll(): Promise<ThreadResponseDto[]> {
    return this.threadsService.getAll();
  }

  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ThreadWithCommentsResponseDto> {
    return this.threadsService.getById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/')
  async create(
    @Body() thread: CreateThreadDto,
    @Request() request: RequestWith<ValidatedUser>,
  ): Promise<ThreadWithCommentsResponseDto> {
    return this.threadsService.create({
      ...thread,
      author: request.user.username,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/comments')
  async createComment(
    @Param('id', ParseIntPipe) threadId: number,
    @Body() body: CreateCommentDto,
    @Request() request: RequestWith<ValidatedUser>,
  ): Promise<CommentResponse> {
    // Ensure the thread exists before creating a comment for it
    await this.threadsService.getById(threadId);
    return this.commentsService.create({
      ...body,
      threadId,
      author: request.user.username,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteById(
    @Param('id', ParseIntPipe) id: number,
    @Request() request: RequestWith<ValidatedUser>,
  ): Promise<boolean> {
    return this.threadsService.delete(id, request.user);
  }
}
