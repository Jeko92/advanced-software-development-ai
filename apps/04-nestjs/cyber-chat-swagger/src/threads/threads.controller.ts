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
  Request,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { ThreadsService } from './threads.service.ts';
import { CreateThreadDto } from './dto/create-thread.dto.ts';
import { UpdateThreadDto } from './dto/update-thread.dto.ts';
import { ThreadResponseDto } from './dto/thread-response.dto.ts';
import { ThreadWithCommentsResponseDto } from './dto/thread-with-comments-response.dto.ts';
import { PaginatedThreadsResponseDto } from './dto/paginated-threads-response.dto.ts';
import { CreateCommentDto } from '../comments/dto/create-comment.dto.ts';
import { CommentResponseDto } from '../comments/dto/comment-response.dto.ts';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto.ts';
import { ParseDatePipe } from '../common/pipes/parse-date.pipe.ts';
import type { RequestWithUser } from '../common/types/request-with-user.ts';

@ApiBearerAuth()
@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @Get()
  @ApiOperation({
    summary: 'List threads, paginated and optionally filtered',
  })
  @ApiOkResponse({ type: PaginatedThreadsResponseDto })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Page size, 1-100 (default 10)',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['createdAt', '-createdAt'],
  })
  @ApiQuery({
    name: 'author',
    required: false,
    type: String,
    description: 'Filter by author username',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'ISO date; only threads created on or after this date',
  })
  async getAll(
    @Query() pagination: PaginationQueryDto,
    @Query('startDate', ParseDatePipe) startDate?: Date,
  ) {
    return await this.threadsService.getAll(pagination, startDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single thread with its comments' })
  @ApiOkResponse({ type: ThreadWithCommentsResponseDto })
  @ApiNotFoundResponse({ description: 'No thread exists with that id' })
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
  @ApiOperation({ summary: 'Start a new thread' })
  @ApiCreatedResponse({ type: ThreadResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  async create(
    @Body() dto: CreateThreadDto,
    @Request() req: RequestWithUser,
  ): Promise<ThreadResponseDto> {
    return await this.threadsService.addNewThread(
      dto,
      req.user.id,
      req.user.username,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a thread you own' })
  @ApiOkResponse({ type: ThreadResponseDto })
  @ApiNotFoundResponse({ description: 'No thread exists with that id' })
  @ApiForbiddenResponse({ description: 'You do not own this thread' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateThreadDto,
    @Request() req: RequestWithUser,
  ): Promise<ThreadResponseDto> {
    const thread = await this.threadsService.updateThread(
      id,
      dto,
      req.user.id,
      req.user.roles,
    );
    if (!thread) {
      throw new NotFoundException(`Thread with id ${id} not found`);
    }
    return thread;
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a thread' })
  @ApiCreatedResponse({ type: CommentResponseDto })
  @ApiNotFoundResponse({ description: 'No thread exists with that id' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  async addComment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateCommentDto,
    @Request() req: RequestWithUser,
  ): Promise<CommentResponseDto> {
    const comment = await this.threadsService.addCommentToThread(
      id,
      dto,
      req.user.id,
      req.user.username,
    );
    if (!comment) {
      throw new NotFoundException(`Thread with id ${id} not found`);
    }
    return comment;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a thread you own' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'No thread exists with that id' })
  @ApiForbiddenResponse({ description: 'You do not own this thread' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: RequestWithUser,
  ): Promise<void> {
    const removed = await this.threadsService.deleteThread(
      id,
      req.user.id,
      req.user.roles,
    );
    if (!removed) {
      throw new NotFoundException(`Thread with id ${id} not found`);
    }
  }
}
