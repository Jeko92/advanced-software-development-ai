import { Test, TestingModule } from '@nestjs/testing';
import { type INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { describe, beforeAll, afterAll, it, expect } from 'vitest';
import { AppModule } from '../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();

    // Mirror your main.ts setup here
    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    // /users is behind AuthGuard, so authenticate once up front and reuse
    // the token across the tests below.
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'alice', password: 'secret' })
      .expect(200);

    token = loginResponse.body.access_token;
  });

  it('rejects access to a protected route without a token', () => {
    return request(app.getHttpServer()).get('/users').expect(401);
  });

  it('creates a user and fetches them successfully', async () => {
    // Simulate a POST request to create the resource
    const response = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Alice', email: 'alice@example.com' })
      .expect(201);

    // Assert the dynamic response structure
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      name: 'Alice',
      email: 'alice@example.com',
    });

    const createdId = response.body.id;

    // Simulate a GET request to verify persistence
    return request(app.getHttpServer())
      .get(`/users/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect({ id: createdId, name: 'Alice', email: 'alice@example.com' });
  });

  it('returns a 404 status for an unknown user ID', () => {
    return request(app.getHttpServer())
      .get('/users/99999')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });

  it('returns a 400 status for a malformed payload', () => {
    // Include a valid token so this exercises the ValidationPipe
    // specifically, not the AuthGuard - guards run before pipes, so an
    // unauthenticated request would 401 before validation ever ran.
    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Bob' })
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
