import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CommentResponse } from './dto/CommentResponseDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment, type CreateCommentPayload } from './entity/comment.entity';
import type { Repository } from 'typeorm';
import type { ValidatedUser } from '../users/entity/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
  ) {}

  async getById(id: number): Promise<CommentResponse> {
    const comment = await this.commentsRepository.findOneBy({ id });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return plainToInstance(CommentResponse, comment, {
      excludeExtraneousValues: true,
    });
  }

  async getByThreadId(threadId: number): Promise<CommentResponse[]> {
    const comments = await this.commentsRepository.findBy({ threadId });
    return plainToInstance(CommentResponse, comments, {
      excludeExtraneousValues: true,
    });
  }

  async create(comment: CreateCommentPayload): Promise<CommentResponse> {
    const newComment = this.commentsRepository.save(comment);
    return plainToInstance(CommentResponse, newComment, {
      excludeExtraneousValues: true,
    });
  }

  async softDelete(id: number, user: ValidatedUser): Promise<boolean> {
    const comment = await this.commentsRepository.findOneBy({ id });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const isAuthor = comment.author === user.username;
    const isAdmin = user.roles.includes('ADMIN');

    if (!isAuthor && !isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to delete this comment',
      );
    }

    this.commentsRepository.update({ id }, { body: '[deleted]' });
    return true;
  }

  async deleteByThreadId(threadId: number): Promise<boolean> {
    const result = await this.commentsRepository.delete({ threadId });

    return !!result.affected && result.affected > 0;
  }
}
