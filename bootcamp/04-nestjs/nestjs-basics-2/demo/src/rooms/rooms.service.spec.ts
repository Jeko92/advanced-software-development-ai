import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service.ts';
import { RoomsRepository } from './rooms.repository.ts';
import { BoardgamesRepository } from '../boardgames/boardgames.repository.ts';

describe('RoomsService', () => {
  let service: RoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomsService, RoomsRepository, BoardgamesRepository],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
