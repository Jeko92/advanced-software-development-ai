import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Thread } from './entities/threads.entity';
import { CommentsService } from '../comments/comments.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { ThreadResponseDto } from './dto/thread-response.dto';
import { plainToInstance } from 'class-transformer';
import { ThreadWithCommentsResponseDto } from './dto/thread-with-comments-response.dto';
import type { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import type { UserRole } from '../users/entities/user.entity';
import { canBypassOwnership } from '../common/utils/authorization.util';

@Injectable()
export class ThreadsService {
  constructor(
    @InjectRepository(Thread)
    private readonly threads: Repository<Thread>,
    private readonly commentsService: CommentsService,
  ) {}

  async getAll(pagination: PaginationQueryDto, startDate?: Date) {
    const { page, limit, sort, author } = pagination;

    const [threads, total] = await this.threads.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        ...(author ? { authorUser: { username: author } } : {}),
        ...(startDate ? { createdAt: MoreThanOrEqual(startDate) } : {}),
      },
      order: { createdAt: sort?.startsWith('-') ? 'DESC' : 'ASC' },
    });

    return {
      data: plainToInstance(
        ThreadResponseDto,
        threads.map((thread) => ({
          ...thread,
          author: thread.authorUser.username,
        })),
        { excludeExtraneousValues: true },
      ),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(threadId: string): Promise<Thread | null> {
    return this.threads.findOneBy({ id: threadId });
  }

  async getByIdWithComments(
    threadId: string,
  ): Promise<ThreadWithCommentsResponseDto | undefined> {
    const thread = await this.getById(threadId);
    if (!thread) return undefined;

    const comments = await this.commentsService.getCommentsByThreadId(
      thread.id,
    );
    return plainToInstance(
      ThreadWithCommentsResponseDto,
      {
        ...thread,
        author: thread.authorUser.username,
        comments: comments.map((comment) => ({
          ...comment,
          author: comment.authorUser.username,
        })),
      },
      { excludeExtraneousValues: true },
    );
  }

  async addCommentToThread(
    threadId: string,
    dto: CreateCommentDto,
    authorId: string,
    authorUsername: string,
  ) {
    const thread = await this.getById(threadId);
    if (!thread) return undefined;

    return this.commentsService.addComment(
      thread.id,
      dto,
      authorId,
      authorUsername,
    );
  }

  async addNewThread(
    dto: CreateThreadDto,
    authorId: string,
    authorUsername: string,
  ): Promise<ThreadResponseDto> {
    const thread = this.threads.create({ ...dto, authorId });
    const saved = await this.threads.save(thread);
    return plainToInstance(
      ThreadResponseDto,
      { ...saved, author: authorUsername },
      { excludeExtraneousValues: true },
    );
  }

  async updateThread(
    threadId: string,
    dto: UpdateThreadDto,
    userId: string,
    userRoles: UserRole[],
  ): Promise<ThreadResponseDto | undefined> {
    const thread = await this.getById(threadId);
    if (!thread) return undefined;

    if (thread.authorId !== userId && !canBypassOwnership(userRoles)) {
      throw new ForbiddenException(
        'You do not have permission to edit this thread',
      );
    }

    const authorUsername = thread.authorUser.username;
    Object.assign(thread, dto);
    const saved = await this.threads.save(thread);
    return plainToInstance(
      ThreadResponseDto,
      { ...saved, author: authorUsername },
      { excludeExtraneousValues: true },
    );
  }

  async deleteThread(
    threadId: string,
    userId: string,
    userRoles: UserRole[],
  ): Promise<boolean> {
    const thread = await this.getById(threadId);
    if (!thread) return false;

    if (thread.authorId !== userId && !canBypassOwnership(userRoles)) {
      throw new ForbiddenException(
        'You do not have permission to delete this thread',
      );
    }

    await this.commentsService.deleteCommentsByThreadId(thread.id);
    await this.threads.delete(thread.id);
    return true;
  }
}
