import { Test, TestingModule } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { beforeAll, describe, afterAll, it } from 'vitest';
import { AuthModule } from './auth.module';

describe('AuthController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('authenticates a user and accesses a protected route', async () => {
    // Authenticate to retrieve the token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'alice', password: 'secret' })
      .expect(200);

    const token = loginResponse.body.access_token;

    // Attach the token to the subsequent request
    return request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
