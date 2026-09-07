import { Test, TestingModule } from '@nestjs/testing';
import { BoardgamesController } from './boardgames.controller';
import { BoardgamesService } from './boardgames.service';
import { BoardgamesRepository } from './boardgames.repository';

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
