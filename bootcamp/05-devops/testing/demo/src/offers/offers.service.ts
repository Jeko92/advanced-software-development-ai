import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './offer.entity.ts';
import { User } from '../users/user.entity.ts';
import { CreateOfferDto } from './dto/create-offer.dto.ts';
import { AuctionsService } from '../auctions/auctions.service.ts';
import type { Page, PageRequest } from '../common/types/page.type.ts';

/**
 * All the bidding rules live here.
 *
 * Like every service in this app it deals in entities and plain types only —
 * `OffersController` is what turns those into JSON.
 */
@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly auctionsService: AuctionsService,
  ) {}

  /**
   * Places a bid, if the rules allow it.
   *
   * The status codes are chosen to say what actually went wrong:
   *  - 404 for an auction that does not exist (raised by the lookup below);
   *  - 403 for bidding on your own listing — the request is well-formed and the
   *    state is fine; this caller is simply not allowed;
   *  - 409 for a closed auction or a bid that does not beat the current price.
   *    Nothing is wrong with the payload's syntax, so 400 would be misleading;
   *    the request conflicts with the present state of the resource, and that
   *    same request could succeed against a different state.
   *
   * Accepting a bid is two writes: insert the offer, and raise the auction's
   * `currentPrice`. They are done one after the other for readability. A
   * production system would wrap them in a transaction so a crash in between
   * cannot leave a recorded bid that never moved the price.
   */
  async create(
    auctionId: string,
    dto: CreateOfferDto,
    bidder: User,
  ): Promise<Offer> {
    const auction = await this.auctionsService.findEntityOrFail(auctionId);

    if (auction.seller.id === bidder.id) {
      throw new ForbiddenException('You cannot bid on your own auction');
    }

    if (auction.endDate.getTime() <= Date.now()) {
      throw new ConflictException('This auction has already closed');
    }

    // `currentPrice` is seeded with `startingPrice` when the auction is
    // created, so this one comparison covers the first bid and every bid
    // after it. Strictly greater: matching the current price is not beating it.
    if (dto.amount <= auction.currentPrice) {
      throw new ConflictException(
        `Bid must be higher than the current price of ${auction.currentPrice}`,
      );
    }

    const offer = await this.offersRepository.save(
      this.offersRepository.create({
        amount: dto.amount,
        auction,
        bidder,
      }),
    );

    await this.auctionsService.raiseCurrentPrice(auction, dto.amount);

    return offer;
  }

  /**
   * The bid history for one listing, newest first.
   *
   * The auction is looked up first so that an unknown id answers 404 rather
   * than an empty page, which would wrongly suggest a real auction with no bids.
   */
  async findByAuction(
    auctionId: string,
    page: PageRequest,
  ): Promise<Page<Offer>> {
    await this.auctionsService.findEntityOrFail(auctionId);

    const [offers, totalItems] = await this.offersRepository.findAndCount({
      where: { auction: { id: auctionId } },
      relations: { bidder: true },
      order: { createdAt: 'DESC', amount: 'DESC' },
      skip: page.offset,
      take: page.limit,
    });

    return { data: offers, totalItems };
  }
}
