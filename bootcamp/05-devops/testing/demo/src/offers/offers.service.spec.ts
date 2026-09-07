import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OffersService } from './offers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Offer } from './offer.entity';
import { AuctionsService } from '../auctions/auctions.service';

const mockOfferRepository = {
  findAndCount: vi.fn(),
};

const mockAuctionService = {
  findEntityOrFail: vi.fn(),
};

describe('OfferService', () => {
  let service: OffersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OffersService,
        {
          provide: getRepositoryToken(Offer),
          useValue: mockOfferRepository,
        },
        {
          provide: AuctionsService,
          useValue: mockAuctionService,
        },
      ],
    }).compile();

    service = module.get(OffersService);
  });

  it('retrieves all offers by auction', async () => {
    mockAuctionService.findEntityOrFail.mockResolvedValue({
      id: 'auction-test-1',
    });
    const offers = [{ id: 'test-1', auctionId: 'auction-test-1' }];
    mockOfferRepository.findAndCount.mockResolvedValue([offers, 1]);

    const result = await service.findByAuction('auction-test-1', {
      offset: 0,
      limit: 10,
    });

    expect(mockAuctionService.findEntityOrFail).toHaveBeenCalledWith(
      'auction-test-1',
    );

    expect(result).toEqual({ data: offers, totalItems: 1 });
  });
});
