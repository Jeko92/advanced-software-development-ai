import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comments.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { plainToInstance } from 'class-transformer';
import type { UserRole } from '../users/entities/user.entity';
import { canBypassOwnership } from '../common/utils/authorization.util';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly comments: Repository<Comment>,
  ) {}

  async getCommentById(id: string): Promise<CommentResponseDto | null> {
    const comment = await this.comments.findOneBy({ id });
    if (!comment) return null;
    return plainToInstance(
      CommentResponseDto,
      { ...comment, author: comment.authorUser.username },
      { excludeExtraneousValues: true },
    );
  }

  async getCommentsByThreadId(threadId: string): Promise<Comment[]> {
    return this.comments.find({ where: { threadId } });
  }

  async addComment(
    threadId: string,
    dto: CreateCommentDto,
    authorId: string,
    authorUsername: string,
  ): Promise<CommentResponseDto> {
    const comment = this.comments.create({ ...dto, threadId, authorId });
    const saved = await this.comments.save(comment);
    return plainToInstance(
      CommentResponseDto,
      { ...saved, author: authorUsername },
      { excludeExtraneousValues: true },
    );
  }

  async updateComment(
    id: string,
    dto: UpdateCommentDto,
    userId: string,
    userRoles: UserRole[],
  ): Promise<CommentResponseDto | undefined> {
    const comment = await this.comments.findOneBy({ id });
    if (!comment) return undefined;

    if (comment.authorId !== userId && !canBypassOwnership(userRoles)) {
      throw new ForbiddenException(
        'You do not have permission to edit this comment',
      );
    }

    const authorUsername = comment.authorUser.username;
    Object.assign(comment, dto);
    const saved = await this.comments.save(comment);
    return plainToInstance(
      CommentResponseDto,
      { ...saved, author: authorUsername },
      { excludeExtraneousValues: true },
    );
  }

  async deleteCommentsByThreadId(threadId: string): Promise<void> {
    await this.comments.delete({ threadId });
  }

  async deleteComment(
    id: string,
    userId: string,
    userRoles: UserRole[],
  ): Promise<boolean> {
    const comment = await this.comments.findOneBy({ id });
    if (!comment) return false;

    if (comment.authorId !== userId && !canBypassOwnership(userRoles)) {
      throw new ForbiddenException(
        'You do not have permission to delete this comment',
      );
    }

    const result = await this.comments.update(id, { body: 'deleted' });
    return (result.affected ?? 0) > 0;
  }
}
