import { Test, TestingModule } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { describe, beforeAll, afterAll, it, vi } from 'vitest';
import { UserController } from './user.controller.ts';
import { UserService } from './user.service.ts';
import { User } from './entities/user.entity.ts';

const mockUserRepository = {
  find: vi.fn().mockResolvedValue([{ id: 1, name: 'Alice' }]),
};

describe('UserController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('GET /users retrieves an array of users successfully', async () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect([{ id: 1, name: 'Alice' }]);
  });

  afterAll(async () => {
    await app.close();
  });
});
