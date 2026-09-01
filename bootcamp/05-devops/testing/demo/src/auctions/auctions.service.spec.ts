import { getRepositoryToken } from '@nestjs/typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuctionsService } from './auctions.service';
import { Test } from '@nestjs/testing';
import { Auction } from './auction.entity';

const mockAuctionsRepository = {
  findAndCount: vi.fn(),
};

describe('AuctionsService', () => {
  let service: AuctionsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuctionsService,
        {
          provide: getRepositoryToken(Auction),
          useValue: mockAuctionsRepository,
        },
      ],
    }).compile();

    service = module.get(AuctionsService);
  });

  it('finds all auctions', async () => {
    const allAuctions = [
      {
        id: 'test-1',
        title: 'Test Title',
        description: 'Test Description',
      },
    ];
    mockAuctionsRepository.findAndCount.mockResolvedValue([allAuctions, 1]);

    const result = await service.findAll({ offset: 0, limit: 10 });

    expect(result).toEqual({ data: allAuctions, totalItems: 1 });
  });

  it('uses the pagination values correctly', async () => {
    const allAuctions = [
      {
        id: 'test-6',
      },
    ];
    mockAuctionsRepository.findAndCount.mockResolvedValue([allAuctions, 1]);

    await service.findAll({ offset: 3, limit: 2 });

    expect(mockAuctionsRepository.findAndCount).toHaveBeenCalledWith({
      where: {},
      take: 2,
      relations: { seller: true },
      order: { endDate: 'DESC', id: 'DESC' },
      skip: 3,
    });
  });
});
