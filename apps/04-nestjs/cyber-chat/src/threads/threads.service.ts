import { Injectable } from '@nestjs/common';
import { type Thread, THREADS } from './entities/threads.entity.ts';
import { type Comment } from '../comments/entities/comments.entity.ts';
import { CommentsService } from '../comments/comments.service.ts';

@Injectable()
export class ThreadsService {
  private threads: Thread[] = [...THREADS];

  constructor(private readonly commentsService: CommentsService) {}

  getAll() {
    return this.threads;
  }

  getById(threadId: string) {
    return this.threads.find((thread) => thread.id === Number(threadId));
  }

  getByIdWithComments(threadId: string) {
    const thread = this.getById(threadId);
    if (!thread) return undefined;

    return {
      ...thread,
      comments: this.commentsService.getCommentsByThreadId(thread.id),
    };
  }

  addCommentToThread(threadId: string, body: Omit<Comment, 'id' | 'threadId'>) {
    const thread = this.getById(threadId);
    if (!thread) return undefined;

    return this.commentsService.addComment(thread.id, body);
  }

  addNewThread(body: Omit<Thread, 'id'>) {
    const nextId =
      Math.max(0, ...this.threads.map((thread) => Number(thread.id))) + 1;

    const newThread: Thread = { id: nextId, ...body };
    this.threads.push(newThread);

    return newThread;
  }

  deleteThread(threadId: string) {
    const threadIndex = this.threads.findIndex(
      (thread) => thread.id === Number(threadId),
    );
    if (threadIndex === -1) {
      return false;
    }

    const [deletedThread] = this.threads.splice(threadIndex, 1);
    this.commentsService.deleteCommentsByThreadId(deletedThread!.id);
    return true;
  }
}
