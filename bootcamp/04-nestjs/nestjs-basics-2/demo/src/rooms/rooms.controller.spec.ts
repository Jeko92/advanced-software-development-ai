import { Test, TestingModule } from '@nestjs/testing';
import { RoomsController } from './rooms.controller.ts';
import { RoomsService } from './rooms.service.ts';
import { RoomsRepository } from './rooms.repository.ts';
import { BoardgamesRepository } from '../boardgames/boardgames.repository.ts';

describe('RoomsController', () => {
  let controller: RoomsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [RoomsService, RoomsRepository, BoardgamesRepository],
    }).compile();

    controller = module.get<RoomsController>(RoomsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
