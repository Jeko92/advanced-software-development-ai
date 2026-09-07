import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { Auction } from './auction.entity';
import { User } from '../users/user.entity';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { AuctionStatus } from './auction-status.enum';
import type { Page, PageRequest } from '../common/types/page.type';
import type { AuctionQuery } from './auction-query.type';

/** How long a listing runs when the seller does not say. */
const DEFAULT_DURATION_DAYS = 3;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * All the auction rules live here.
 *
 * Every method takes and returns plain types — entities, `Page`, `PageRequest`
 * — and never a request or response DTO. Those belong to the controller, which
 * is the only part of the app that knows HTTP exists.
 */
@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionsRepository: Repository<Auction>,
  ) {}

  /**
   * Lists an item for sale.
   *
   * Two defaults are applied here rather than in the database, because both are
   * business rules and belong where the rest of the business rules live:
   *  - a missing `endDate` becomes three days out;
   *  - `currentPrice` starts equal to `startingPrice`, which is what lets the
   *    bidding rule stay a single comparison.
   */
  async create(dto: CreateAuctionDto, seller: User): Promise<Auction> {
    const auction = this.auctionsRepository.create({
      title: dto.title,
      description: dto.description,
      startingPrice: dto.startingPrice,
      currentPrice: dto.startingPrice,
      endDate:
        dto.endDate ??
        new Date(Date.now() + DEFAULT_DURATION_DAYS * MS_PER_DAY),
      seller,
    });

    return await this.auctionsRepository.save(auction);
  }

  /**
   * Browsable, filterable, paginated list of auctions.
   *
   * The filters are assembled into one `where` object and handed to
   * `findAndCount()`, which runs the page query and its matching `COUNT(*)` in
   * a single call — that is what makes the `totalItems` metadata cheap.
   *
   * `MoreThan`, `Between` and friends are TypeORM's way of writing `>` and
   * `BETWEEN` without dropping down to a query builder.
   */
  async findAll(query: AuctionQuery & PageRequest): Promise<Page<Auction>> {
    const where: FindOptionsWhere<Auction> = {};

    // Status is derived from the clock, not stored, so it becomes a comparison
    // against "now" rather than a lookup on a column.
    if (query.status) {
      const now = new Date();
      where.endDate =
        query.status === AuctionStatus.Open
          ? MoreThan(now)
          : LessThanOrEqual(now);
    }

    // One column, so the two price filters have to be combined into a single
    // condition instead of assigned one after the other.
    if (query.minPrice !== undefined && query.maxPrice !== undefined) {
      where.currentPrice = Between(query.minPrice, query.maxPrice);
    } else if (query.minPrice !== undefined) {
      where.currentPrice = MoreThanOrEqual(query.minPrice);
    } else if (query.maxPrice !== undefined) {
      where.currentPrice = LessThanOrEqual(query.maxPrice);
    }

    const [auctions, totalItems] = await this.auctionsRepository.findAndCount({
      where,
      relations: { seller: true },
      // `id` breaks ties so that two auctions ending at the same moment keep a
      // stable order across pages.
      order: { endDate: 'DESC', id: 'DESC' },
      skip: query.offset,
      take: query.limit,
    });

    return { data: auctions, totalItems };
  }

  async findOne(id: string): Promise<Auction> {
    return this.findEntityOrFail(id);
  }

  /**
   * Shared lookup used by this service and by the bidding logic.
   *
   * Returning the entity (not a DTO) is deliberate: callers inside the
   * application need the real row to apply rules against, while the mapping to
   * a DTO happens only at the edge that answers HTTP.
   */
  async findEntityOrFail(id: string): Promise<Auction> {
    const auction = await this.auctionsRepository.findOne({
      where: { id },
      relations: { seller: true },
    });

    if (!auction) {
      throw new NotFoundException(`Auction ${id} not found`);
    }

    return auction;
  }

  /**
   * Moves the asking price up after a bid was accepted.
   *
   * It lives here rather than in `OffersService` because `currentPrice` is a
   * column on the auction, and every rule about auctions stays in this module.
   */
  async raiseCurrentPrice(auction: Auction, amount: number): Promise<Auction> {
    auction.currentPrice = amount;
    return await this.auctionsRepository.save(auction);
  }
}
