import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { AppController } from './app.controller';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: getDataSourceToken(), useValue: { isInitialized: true } },
      ],
    }).compile();

    controller = module.get(AppController);
  });

  it('reports database connectivity', () => {
    const health = controller.getHealth();
    expect(health.status).toBe('ok');
    expect(health.database.connected).toBe(true);
  });
});
