import { Test, TestingModule } from '@nestjs/testing';
import { BoardgamesController } from './boardgames.controller.ts';
import { BoardgamesService } from './boardgames.service.ts';
import { BoardgamesRepository } from './boardgames.repository.ts';

describe('BoardgamesController', () => {
  let controller: BoardgamesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardgamesController],
      providers: [BoardgamesService, BoardgamesRepository],
    }).compile();

    controller = module.get<BoardgamesController>(BoardgamesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
