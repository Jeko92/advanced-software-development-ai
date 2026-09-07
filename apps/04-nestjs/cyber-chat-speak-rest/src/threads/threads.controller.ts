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
  Post,
  Query,
} from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { ThreadResponseDto } from './dto/thread-response.dto';
import { ThreadWithCommentsResponseDto } from './dto/thread-with-comments-response.dto';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { CommentResponseDto } from '../comments/dto/comment-response.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { ParseDatePipe } from '../common/pipes/parse-date.pipe';

@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @Get()
  async getAll(
    @Query() pagination: PaginationQueryDto,
    @Query('startDate', ParseDatePipe) startDate?: Date,
  ) {
    return await this.threadsService.getAll(pagination, startDate);
  }

  @Get(':id')
  async getOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ThreadWithCommentsResponseDto> {
    const thread = await this.threadsService.getByIdWithComments(id);
    if (!thread) {
      throw new NotFoundException(`Thread with id ${id} not found`);
    }
    return thread;
  }

  @Post()
  async create(@Body() dto: CreateThreadDto): Promise<ThreadResponseDto> {
    return await this.threadsService.addNewThread(dto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateThreadDto,
  ): Promise<ThreadResponseDto> {
    const thread = await this.threadsService.updateThread(id, dto);
    if (!thread) {
      throw new NotFoundException(`Thread with id ${id} not found`);
    }
    return thread;
  }

  @Post(':id/comments')
  async addComment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    const comment = await this.threadsService.addCommentToThread(id, dto);
    if (!comment) {
      throw new NotFoundException(`Thread with id ${id} not found`);
    }
    return comment;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const removed = await this.threadsService.deleteThread(id);
    if (!removed) {
      throw new NotFoundException(`Thread with id ${id} not found`);
    }
  }
}
