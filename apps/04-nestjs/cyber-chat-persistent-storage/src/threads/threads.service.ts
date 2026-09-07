import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Thread } from './entities/threads.entity.ts';
import { type Comment } from '../comments/entities/comments.entity.ts';
import { CommentsService } from '../comments/comments.service.ts';

@Injectable()
export class ThreadsService {
  constructor(
    @InjectRepository(Thread)
    private readonly threads: Repository<Thread>,
    private readonly commentsService: CommentsService,
  ) {}

  async getAll(): Promise<Thread[]> {
    return this.threads.find();
  }

  async getById(threadId: string): Promise<Thread | null> {
    return this.threads.findOneBy({ id: threadId });
  }

  async getByIdWithComments(threadId: string) {
    const thread = await this.getById(threadId);
    if (!thread) return undefined;

    return {
      ...thread,
      comments: await this.commentsService.getCommentsByThreadId(thread.id),
    };
  }

  async addCommentToThread(
    threadId: string,
    body: Omit<Comment, 'id' | 'threadId' | 'createdAt' | 'thread'>,
  ) {
    const thread = await this.getById(threadId);
    if (!thread) return undefined;

    return this.commentsService.addComment(thread.id, body);
  }

  async addNewThread(
    body: Omit<Thread, 'id' | 'createdAt' | 'comments'>,
  ): Promise<Thread> {
    const thread = this.threads.create(body);
    return this.threads.save(thread);
  }

  async deleteThread(threadId: string): Promise<boolean> {
    const thread = await this.getById(threadId);
    if (!thread) return false;

    await this.commentsService.deleteCommentsByThreadId(thread.id);
    await this.threads.delete(thread.id);
    return true;
  }
}
