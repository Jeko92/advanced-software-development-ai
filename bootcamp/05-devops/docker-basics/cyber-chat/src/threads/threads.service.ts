import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommentsService } from '../comments/comments.service';
import { InjectRepository } from '@nestjs/typeorm';
import { type CreateThreadPayload, Thread } from './entity/thread.entity';
import type { Repository, UpdateResult } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { ThreadWithCommentsResponseDto } from './dto/ThreadWithCommentsResponseDto';
import { ThreadResponseDto } from './dto/ThreadResponseDto';
import type { ValidatedUser } from '../users/entity/user.entity';

@Injectable()
export class ThreadsService {
  constructor(
    @InjectRepository(Thread)
    private readonly threadsRepository: Repository<Thread>,
    private readonly commentsService: CommentsService,
  ) {}

  async getAll(): Promise<ThreadResponseDto[]> {
    const threads = await this.threadsRepository.find();

    return plainToInstance(ThreadResponseDto, threads);
  }

  async getById(id: number): Promise<ThreadWithCommentsResponseDto> {
    const thread = await this.threadsRepository.findOneBy({ id });

    if (!thread) throw new NotFoundException('Thread not found');

    const comments = await this.commentsService.getByThreadId(id);

    return plainToInstance(ThreadWithCommentsResponseDto, {
      ...thread,
      comments,
    });
  }

  async create(thread: CreateThreadPayload): Promise<Thread> {
    return plainToInstance(
      ThreadWithCommentsResponseDto,
      await this.threadsRepository.save(thread),
    );
  }

  async delete(id: number, user: ValidatedUser): Promise<boolean> {
    const thread = await this.threadsRepository.findOneBy({ id });

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    const isAuthor = thread.author === user.username;
    const isAdmin = user.roles.includes('ADMIN');

    if (!isAuthor && !isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to delete this thread',
      );
    }

    const deletionSuccess = await this.threadsRepository.delete(id);

    if (!deletionSuccess) {
      throw new InternalServerErrorException('Thread could not be deleted');
    }

    this.commentsService.deleteByThreadId(id);

    return true;
  }

  async update(id: number, thread: Partial<Thread>): Promise<UpdateResult> {
    const updatedThread = await this.threadsRepository.update({ id }, thread);

    if (!updatedThread) {
      throw new NotFoundException('Thread not found');
    }

    return updatedThread;
  }
}
