import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comments.entity.ts';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly comments: Repository<Comment>,
  ) {}

  async getCommentById(id: string): Promise<Comment | null> {
    return this.comments.findOneBy({ id });
  }

  async getCommentsByThreadId(threadId: string): Promise<Comment[]> {
    return this.comments.find({ where: { threadId } });
  }

  addComment(
    threadId: string,
    body: Omit<Comment, 'id' | 'threadId' | 'createdAt' | 'thread'>,
  ): Promise<Comment> {
    const comment = this.comments.create({ ...body, threadId });
    return this.comments.save(comment);
  }

  async deleteCommentsByThreadId(threadId: string): Promise<void> {
    await this.comments.delete({ threadId });
  }

  async deleteComment(id: string): Promise<boolean> {
    const result = await this.comments.update(id, { body: 'deleted' });
    return (result.affected ?? 0) > 0;
  }
}
