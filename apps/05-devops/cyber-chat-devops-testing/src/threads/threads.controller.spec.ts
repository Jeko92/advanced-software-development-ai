import { Test, type TestingModule } from '@nestjs/testing';
import {
  type ExecutionContext,
  type INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import request from 'supertest';
import { ThreadsController } from './threads.controller.ts';
import { ThreadsService } from './threads.service.ts';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Thread } from './entities/threads.entity.ts';
import { CommentsService } from '../comments/comments.service.ts';
import { makeUser } from '../test/factories/user.factory.ts';
import { makeThread, THREAD_ID } from '../test/factories/thread.factory.ts';

const NON_EXISTENT_THREAD_ID = '99999999-9999-4999-8999-999999999999';

const mockThreadRepository = {
  findAndCount: vi.fn(),
  findOneBy: vi.fn(),
  create: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
};

const mockCommentsService = {
  getCommentsByThreadId: vi.fn(),
  addComment: vi.fn(),
  deleteCommentsByThreadId: vi.fn(),
};

describe('ThreadsController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThreadsController],
      providers: [
        ThreadsService,
        { provide: getRepositoryToken(Thread), useValue: mockThreadRepository },
        { provide: CommentsService, useValue: mockCommentsService },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalGuards({
      canActivate: (context: ExecutionContext) => {
        context.switchToHttp().getRequest().user = makeUser();
        return true;
      },
    });

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    await app.init();
  });

  // The app/module is only built once in beforeAll (it's expensive - a real
  // HTTP server), but each mock's call history still needs resetting
  // between tests, or an earlier test's calls leak into a later
  // not.toHaveBeenCalled() assertion.
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /threads', () => {
    it('creates a thread and returns 201', async () => {
      // Arrange
      const author = makeUser();
      const dto = { title: 'New thread', body: 'Body text' };
      const created = { ...dto, authorId: author.id };
      const saved = makeThread({ ...created });
      mockThreadRepository.create.mockReturnValue(created);
      mockThreadRepository.save.mockResolvedValue(saved);

      // Act
      const response = await request(app.getHttpServer())
        .post('/threads')
        .send(dto);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: saved.id,
        title: dto.title,
        body: dto.body,
        authorId: author.id,
        author: author.username,
      });
    });

    it('returns 400 when title is missing', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .post('/threads')
        .send({ body: 'Body text only' });

      // Assert
      expect(response.status).toBe(400);
      expect(mockThreadRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('GET /threads/:id', () => {
    it('returns the thread with its comments when it exists', async () => {
      // Arrange
      const thread = makeThread();
      mockThreadRepository.findOneBy.mockResolvedValue(thread);
      mockCommentsService.getCommentsByThreadId.mockResolvedValue([]);

      // Act
      const response = await request(app.getHttpServer()).get(
        `/threads/${THREAD_ID}`,
      );

      // Assert
      expect(response.status).toBe(200);
      expect(mockThreadRepository.findOneBy).toHaveBeenCalledWith({
        id: THREAD_ID,
      });
      expect(mockCommentsService.getCommentsByThreadId).toHaveBeenCalledWith(
        thread.id,
      );
      expect(response.body).toMatchObject({
        id: thread.id,
        title: thread.title,
        author: thread.authorUser.username,
        comments: [],
      });
    });

    it('returns 404 for a thread that does not exist', async () => {
      // Arrange
      mockThreadRepository.findOneBy.mockResolvedValue(null);

      // Act
      const response = await request(app.getHttpServer()).get(
        `/threads/${NON_EXISTENT_THREAD_ID}`,
      );

      // Assert
      expect(response.status).toBe(404);
    });
  });
});
