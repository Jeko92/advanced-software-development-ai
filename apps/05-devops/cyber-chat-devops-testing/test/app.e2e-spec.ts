import { Test, type TestingModule } from '@nestjs/testing';
import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { describe, beforeAll, afterAll, it, expect } from 'vitest';
import { AppController } from '../src/app.controller.ts';
import { AppService } from '../src/app.service.ts';
import { ThreadsModule } from '../src/threads/threads.module.ts';
import { CommentsModule } from '../src/comments/comments.module.ts';
import { UsersModule } from '../src/users/users.module.ts';
import AuthModule from '../src/auth/auth.module.ts';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard.ts';
import { Thread } from '../src/threads/entities/threads.entity.ts';
import { Comment } from '../src/comments/entities/comments.entity.ts';
import { User } from '../src/users/entities/user.entity.ts';

// Distinct, validly-shaped UUID for the "not found" case - ParseUUIDPipe
// 400s on a malformed id, so an arbitrary string like 'missing-id' would
// never reach the 404 branch we're actually testing.
const NON_EXISTENT_THREAD_ID = '99999999-9999-4999-8999-999999999999';

describe('App (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    // AppModule bakes in TypeOrmModule.forRoot(AppDataSource.options),
    // which points at the real file-based dev database
    // (data/cyber-chat.sqlite) - so we don't `imports: [AppModule]` here.
    // Instead we rebuild its composition with an in-memory TypeOrmModule
    // swapped in, so this suite never touches real dev data.
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [Thread, Comment, User],
          synchronize: true,
        }),
        ThreadsModule,
        CommentsModule,
        UsersModule,
        AuthModule,
      ],
      controllers: [AppController],
      providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    const credentials = {
      username: 'e2e_test',
      password: 'hunter2ButBetter',
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(credentials)
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(credentials)
      .expect(201);

    token = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates a thread, adds a comment, then fetches both together', async () => {
    const threadResponse = await request(app.getHttpServer())
      .post('/threads')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Best encryption algorithm?',
        body: 'AES-256 vs ChaCha20 - what would you run in production?',
      })
      .expect(201);

    const threadId = threadResponse.body.id;

    const commentResponse = await request(app.getHttpServer())
      .post(`/threads/${threadId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'ChaCha20, no contest.' })
      .expect(201);

    const getResponse = await request(app.getHttpServer())
      .get(`/threads/${threadId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(getResponse.body).toMatchObject({
      id: threadId,
      title: 'Best encryption algorithm?',
      body: 'AES-256 vs ChaCha20 - what would you run in production?',
    });
    expect(getResponse.body.comments).toHaveLength(1);
    expect(getResponse.body.comments[0]).toMatchObject({
      id: commentResponse.body.id,
      threadId,
      body: 'ChaCha20, no contest.',
    });
  });

  it('returns 404 for a thread id that does not exist', async () => {
    await request(app.getHttpServer())
      .get(`/threads/${NON_EXISTENT_THREAD_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });

  // challenges.md Task 4 (optional): malicious payloads.
  it('rejects a thread with an excessively long title', async () => {
    const massiveTitle = 'A'.repeat(50_000);

    await request(app.getHttpServer())
      .post('/threads')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: massiveTitle, body: 'Body text' })
      .expect(400);
  });

  it('ignores a client-supplied id instead of honoring it', async () => {
    // Verified empirically: with this app's ValidationPipe config
    // (whitelist: true, no forbidNonWhitelisted), an unrecognized `id`
    // field is silently stripped rather than rejected - the request
    // succeeds with 201, but using a server-generated id, never the one
    // the client tried to inject.
    const attackerSuppliedId = '00000000-0000-4000-8000-000000000000';

    const response = await request(app.getHttpServer())
      .post('/threads')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: attackerSuppliedId,
        title: 'Overwrite attempt',
        body: 'Trying to dictate my own id',
      })
      .expect(201);

    expect(response.body.id).not.toBe(attackerSuppliedId);
  });
});
