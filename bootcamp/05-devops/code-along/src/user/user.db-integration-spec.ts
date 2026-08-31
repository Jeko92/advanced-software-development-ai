import { Test, TestingModule } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { beforeAll, describe, afterAll, it } from 'vitest';
import { UserController } from './user.controller.ts';
import { UserService } from './user.service.ts';
import { User } from './entities/user.entity.ts';

describe('UserService (database integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [User],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('creates a user and retrieves them by ID', async () => {
    const newUser = { name: 'Alice', email: 'alice@example.com' };

    const createResponse = await request(app.getHttpServer())
      .post('/users')
      .send(newUser)
      .expect(201);

    const createdId = createResponse.body.id;

    return request(app.getHttpServer())
      .get(`/users/${createdId}`)
      .expect(200)
      .expect({ id: createdId, name: 'Alice', email: 'alice@example.com' });
  });

  afterAll(async () => {
    await app.close();
  });
});
