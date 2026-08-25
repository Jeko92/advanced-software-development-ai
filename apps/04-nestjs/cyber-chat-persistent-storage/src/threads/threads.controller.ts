import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ThreadsService } from './threads.service.ts';
import { type Thread } from './entities/threads.entity.ts';
import { type Comment } from '../comments/entities/comments.entity.ts';

type ThreadWithComments = Thread & { comments: Comment[] };

@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @Get()
  async getAll(): Promise<Thread[]> {
    return await this.threadsService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<ThreadWithComments> {
    const thread = await this.threadsService.getByIdWithComments(id);
    if (!thread) {
      throw new NotFoundException(`Thread with id ${id} not found`);
    }
    return thread;
  }

  @Post()
  async create(
    @Body() body: Omit<Thread, 'id' | 'createdAt' | 'comments'>,
  ): Promise<Thread> {
    return await this.threadsService.addNewThread(body);
  }

  @Post(':id/comments')
  async addComment(
    @Param('id') id: string,
    @Body() body: Omit<Comment, 'id' | 'threadId' | 'createdAt' | 'thread'>,
  ): Promise<Comment> {
    const comment = await this.threadsService.addCommentToThread(id, body);
    if (!comment) {
      throw new NotFoundException(`Thread with id ${id} not found`);
    }
    return comment;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ deleted: true }> {
    const removed = await this.threadsService.deleteThread(id);
    if (!removed) {
      throw new NotFoundException(`Thread with id ${id} not found`);
    }
    return { deleted: true };
  }
}
