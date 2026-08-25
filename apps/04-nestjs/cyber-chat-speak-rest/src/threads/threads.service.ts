import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Thread } from './entities/threads.entity.ts';
import { CommentsService } from '../comments/comments.service.ts';
import { CreateThreadDto } from './dto/create-thread.dto.ts';
import { UpdateThreadDto } from './dto/update-thread.dto.ts';
import { CreateCommentDto } from '../comments/dto/create-comment.dto.ts';
import { ThreadResponseDto } from './dto/thread-response.dto.ts';
import { plainToInstance } from 'class-transformer';
import { ThreadWithCommentsResponseDto } from './dto/thread-with-comments-response.dto.ts';
import type { PaginationQueryDto } from '../common/dto/pagination-query.dto.ts';

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
        ...(author ? { author } : {}),
        ...(startDate ? { createdAt: MoreThanOrEqual(startDate) } : {}),
      },
      order: { createdAt: sort?.startsWith('-') ? 'DESC' : 'ASC' },
    });

    return {
      data: plainToInstance(ThreadResponseDto, threads, {
        excludeExtraneousValues: true,
      }),
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
      { ...thread, comments },
      { excludeExtraneousValues: true },
    );
  }

  async addCommentToThread(threadId: string, dto: CreateCommentDto) {
    const thread = await this.getById(threadId);
    if (!thread) return undefined;

    return this.commentsService.addComment(thread.id, dto);
  }

  async addNewThread(dto: CreateThreadDto): Promise<ThreadResponseDto> {
    const thread = this.threads.create(dto);
    const saved = await this.threads.save(thread);
    return plainToInstance(ThreadResponseDto, saved, {
      excludeExtraneousValues: true,
    });
  }

  async updateThread(
    threadId: string,
    dto: UpdateThreadDto,
  ): Promise<ThreadResponseDto | undefined> {
    const thread = await this.getById(threadId);
    if (!thread) return undefined;

    Object.assign(thread, dto);
    const saved = await this.threads.save(thread);
    return plainToInstance(ThreadResponseDto, saved, {
      excludeExtraneousValues: true,
    });
  }

  async deleteThread(threadId: string): Promise<boolean> {
    const thread = await this.getById(threadId);
    if (!thread) return false;

    await this.commentsService.deleteCommentsByThreadId(thread.id);
    await this.threads.delete(thread.id);
    return true;
  }
}
