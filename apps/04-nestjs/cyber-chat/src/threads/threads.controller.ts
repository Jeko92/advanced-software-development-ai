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
  getAll(): Thread[] {
    return this.threadsService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): ThreadWithComments {
    const thread = this.threadsService.getByIdWithComments(id);
    if (!thread) {
      throw new NotFoundException(`Thread with id ${id} not found`);
    }
    return thread;
  }

  @Post()
  create(@Body() body: Omit<Thread, 'id'>) {
    return this.threadsService.addNewThread(body);
  }

  @Post(':id/comments')
  addComment(
    @Param('id') id: string,
    @Body() body: Omit<Comment, 'id' | 'threadId'>,
  ) {
    const comment = this.threadsService.addCommentToThread(id, body);
    if (!comment) {
      throw new NotFoundException(`Thread with id ${id} not found`);
    }
    return comment;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const removed = this.threadsService.deleteThread(id);
    if (!removed) {
      throw new NotFoundException(`Thread with id ${id} not found`);
    }
    return { deleted: true };
  }
}
