import { Test, TestingModule } from '@nestjs/testing';
import { BoardgamesService } from './boardgames.service.ts';
import { BoardgamesRepository } from './boardgames.repository.ts';

describe('BoardgamesService', () => {
  let service: BoardgamesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoardgamesService, BoardgamesRepository],
    }).compile();

    service = module.get<BoardgamesService>(BoardgamesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
