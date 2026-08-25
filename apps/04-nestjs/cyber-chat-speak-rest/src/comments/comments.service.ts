import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comments.entity.ts';
import { CreateCommentDto } from './dto/create-comment.dto.ts';
import { CommentResponseDto } from './dto/comment-response.dto.ts';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly comments: Repository<Comment>,
  ) {}

  async getCommentById(id: string): Promise<CommentResponseDto | null> {
    const comment = await this.comments.findOneBy({ id });
    if (!comment) return null;
    return plainToInstance(CommentResponseDto, comment, {
      excludeExtraneousValues: true,
    });
  }

  async getCommentsByThreadId(threadId: string): Promise<Comment[]> {
    return this.comments.find({ where: { threadId } });
  }

  async addComment(
    threadId: string,
    dto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    const comment = this.comments.create({ ...dto, threadId });
    const saved = await this.comments.save(comment);
    return plainToInstance(CommentResponseDto, saved, {
      excludeExtraneousValues: true,
    });
  }

  async deleteCommentsByThreadId(threadId: string): Promise<void> {
    await this.comments.delete({ threadId });
  }

  async deleteComment(id: string): Promise<boolean> {
    const result = await this.comments.update(id, { body: 'deleted' });
    return (result.affected ?? 0) > 0;
  }
}
