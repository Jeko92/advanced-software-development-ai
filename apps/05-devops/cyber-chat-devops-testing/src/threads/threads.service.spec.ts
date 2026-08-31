import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { ThreadsService } from './threads.service.ts';
import { Thread } from './entities/threads.entity.ts';
import { CommentsService } from '../comments/comments.service.ts';
import { makeThread } from '../test/factories/thread.factory.ts';
import { makeUser } from '../test/factories/user.factory.ts';

const mockThreadRepository = {
  findAndCount: vi.fn(),
  findOneBy: vi.fn(),
  create: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
};

const mockCommentsService = {
  deleteCommentsByThreadId: vi.fn(),
};

describe('ThreadsService', () => {
  let service: ThreadsService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        ThreadsService,
        {
          provide: getRepositoryToken(Thread),
          useValue: mockThreadRepository,
        },
        {
          provide: CommentsService,
          useValue: mockCommentsService,
        },
      ],
    }).compile();

    service = moduleRef.get<ThreadsService>(ThreadsService);
  });

  // challenges.md: "Test that calling findAll returns an array of threads
  describe('getAll', () => {
    it('returns paginated, transformed threads from the repository', async () => {
      const thread = makeThread();
      mockThreadRepository.findAndCount.mockResolvedValue([[thread], 1]);

      const result = await service.getAll({ page: 1, limit: 10 });

      expect(mockThreadRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 10 }),
      );
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toMatchObject({
        id: thread.id,
        title: thread.title,
        author: thread.authorUser.username,
      });
      expect(result.meta).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      });
    });
  });

  // challenges.md: "Test that calling findOne with a valid ID returns the
  // correct thread object" + "with an ID that does not exist throws a
  // NotFoundException" - adapted, since this service returns null on a
  // miss rather than throwing (the controller converts that to a 404).
  describe('getById', () => {
    it('returns thread by ID from the repository', async () => {
      const thread = makeThread();
      mockThreadRepository.findOneBy.mockResolvedValue(thread);

      const result = await service.getById(thread.id);

      expect(mockThreadRepository.findOneBy).toHaveBeenCalledWith({
        id: thread.id,
      });
      expect(result).toBe(thread);
    });

    it('returns null when no thread exists with that id', async () => {
      mockThreadRepository.findOneBy.mockResolvedValue(null);

      const result = await service.getById('missing-id');

      expect(result).toBeNull();
    });
  });

  // challenges.md: "Test that calling create successfully passes the DTO
  // to the repository's save method and returns the new thread."
  describe('addNewThread', () => {
    it('passes the DTO to the repository and returns the saved thread', async () => {
      const author = makeUser();
      const dto = { title: 'New thread', body: 'Body text' };
      const created = { ...dto, authorId: author.id };
      const saved = makeThread({ ...created });
      mockThreadRepository.create.mockReturnValue(created);
      mockThreadRepository.save.mockResolvedValue(saved);

      const result = await service.addNewThread(
        dto,
        author.id,
        author.username,
      );

      expect(mockThreadRepository.create).toHaveBeenCalledWith({
        ...dto,
        authorId: author.id,
      });
      expect(mockThreadRepository.save).toHaveBeenCalledWith(created);
      expect(result).toMatchObject({
        id: saved.id,
        title: dto.title,
        author: author.username,
      });
    });

    // challenges.md Task 4 (optional): "Add a unit test to check what
    // happens if repository.save() throws an unexpected error ... ensure
    // your service handles it gracefully." addNewThread has no try/catch,
    // so "handles gracefully" here means the failure propagates as a
    // rejected promise rather than being swallowed or returning something
    // bogus - Nest's global exception filter turns that into a 500 at the
    // HTTP layer.
    it('propagates the error when the repository fails to save', async () => {
      const author = makeUser();
      const dto = { title: 'New thread', body: 'Body text' };
      const created = { ...dto, authorId: author.id };
      mockThreadRepository.create.mockReturnValue(created);
      mockThreadRepository.save.mockRejectedValue(new Error('DB Offline'));

      await expect(
        service.addNewThread(dto, author.id, author.username),
      ).rejects.toThrow('DB Offline');
    });
  });

  // challenges.md: "Test that calling remove triggers the repository's
  // delete method with the correct ID."
  describe('deleteThread', () => {
    it('deletes the thread and its comments when the caller owns it', async () => {
      const thread = makeThread();
      mockThreadRepository.findOneBy.mockResolvedValue(thread);
      mockCommentsService.deleteCommentsByThreadId.mockResolvedValue(undefined);
      mockThreadRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.deleteThread(thread.id, thread.authorId, [
        'viewer',
      ]);

      expect(mockCommentsService.deleteCommentsByThreadId).toHaveBeenCalledWith(
        thread.id,
      );
      expect(mockThreadRepository.delete).toHaveBeenCalledWith(thread.id);
      expect(result).toBe(true);
    });
  });
});
