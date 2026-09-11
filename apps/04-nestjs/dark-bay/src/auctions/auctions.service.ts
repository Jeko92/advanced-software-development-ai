import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {
  Between,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { AuctionResponseDto } from './dto/auction-response.dto';
import { Auction } from './entities/auction.entity';
import { User } from '../users/entities/user.entity';
import { UserSummaryDto } from '../users/dto/user-summary.dto';
import { addDays } from '../common/utils/utils';
import { auctionStatusWhereClause } from '../common/utils/auction-status.util';
import { AuctionQueryDto } from './dto/auction-query.dto';
import type { RequestWithUser } from '../auth/request-with-user.interface';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionsRepository: Repository<Auction>,
    private readonly configService: ConfigService,
  ) {}

  async create(
    createAuctionDto: CreateAuctionDto,
    seller: UserSummaryDto,
  ): Promise<AuctionResponseDto> {
    const defaultDurationDays = Number(
      this.configService.getOrThrow<string>('DEFAULT_AUCTION_DURATION_DAYS'),
    );
    const endDate = createAuctionDto.endDate
      ? new Date(createAuctionDto.endDate)
      : addDays(new Date(), defaultDurationDays);

    const auction = this.auctionsRepository.create({
      ...createAuctionDto,
      endDate,
      seller: seller as User,
    });
    const saved = await this.auctionsRepository.save(auction);
    return plainToInstance(AuctionResponseDto, saved, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(query: AuctionQueryDto) {
    const { page = 1, limit = 10, status, minPrice, maxPrice } = query;

    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Auction> = {
      ...(status && { endDate: auctionStatusWhereClause(status) }),
    };

    if (minPrice !== undefined && maxPrice !== undefined) {
      where.startingPrice = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      where.startingPrice = MoreThanOrEqual(minPrice);
    } else if (maxPrice !== undefined) {
      where.startingPrice = LessThanOrEqual(maxPrice);
    }

    const [auctions, total] = await this.auctionsRepository.findAndCount({
      where,
      relations: { seller: true },
      skip,
      take: limit,
      order: { endDate: 'DESC' },
    });

    const data = plainToInstance(AuctionResponseDto, auctions, {
      excludeExtraneousValues: true,
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Auction> {
    const auction = await this.auctionsRepository.findOne({
      where: { id },
      relations: { seller: true },
    });
    if (!auction) {
      throw new NotFoundException(`Auction with id ${id} not found`);
    }
    return auction;
  }

  async remove(id: string, requester: RequestWithUser['user']): Promise<void> {
    const auction = await this.findOne(id);

    const isOwner = auction.seller.id === requester.id;
    const isAdmin = requester.roles.includes('admin');
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'Only the auction owner or an admin can delete this auction',
      );
    }

    await this.auctionsRepository.remove(auction);
  }
}
