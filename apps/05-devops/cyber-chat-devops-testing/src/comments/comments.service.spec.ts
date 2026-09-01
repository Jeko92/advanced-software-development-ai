import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comments.entity';
import { makeComment } from '../test/factories/comment.factory';
import { makeUser } from '../test/factories/user.factory';
import { THREAD_ID } from '../test/factories/thread.factory';

const mockCommentRepository = {
  create: vi.fn(),
  save: vi.fn(),
};

describe('CommentsService', () => {
  let service: CommentsService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<CommentsService>(CommentsService);
  });

  // challenges.md: "Test that creating a Comment correctly associates it
  // with a Thread ID before saving it to the repository."
  describe('addComment', () => {
    it('associates the new comment with the thread id before saving it', async () => {
      // Arrange
      const author = makeUser();
      const dto = { body: 'Nice thread!' };
      const created = { ...dto, threadId: THREAD_ID, authorId: author.id };
      const saved = makeComment({ ...created, authorUser: author });
      mockCommentRepository.create.mockReturnValue(created);
      mockCommentRepository.save.mockResolvedValue(saved);

      // Act
      const result = await service.addComment(
        THREAD_ID,
        dto,
        author.id,
        author.username,
      );

      // Assert
      expect(mockCommentRepository.create).toHaveBeenCalledWith({
        ...dto,
        threadId: THREAD_ID,
        authorId: author.id,
      });
      expect(mockCommentRepository.save).toHaveBeenCalledWith(created);
      expect(result).toMatchObject({
        id: saved.id,
        threadId: THREAD_ID,
        body: dto.body,
        author: author.username,
      });
    });
  });
});
