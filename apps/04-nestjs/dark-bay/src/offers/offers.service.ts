import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferResponseDto } from './dto/offer-response.dto';
import { Offer } from './entities/offer.entity';
import { User } from '../users/entities/user.entity';
import { UserSummaryDto } from '../users/dto/user-summary.dto';
import { AuctionsService } from '../auctions/auctions.service';
import { isAuctionOpen } from '../common/utils/utils';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly auctionsService: AuctionsService,
  ) {}

  async placeOffer(
    auctionId: string,
    createOfferDto: CreateOfferDto,
    bidder: UserSummaryDto,
  ): Promise<OfferResponseDto> {
    const auction = await this.auctionsService.findOne(auctionId);

    if (!isAuctionOpen(auction.endDate)) {
      throw new ConflictException(
        `Auction ${auctionId} is closed and no longer accepts offers`,
      );
    }

    if (auction.seller.id === bidder.id) {
      throw new ForbiddenException('Sellers cannot bid on their own auctions');
    }

    const highestOffer = await this.getHighestOfferAmount(auctionId);

    if (highestOffer === null) {
      if (createOfferDto.amount < auction.startingPrice) {
        throw new ConflictException(
          `Offer amount must be at least the starting price (${auction.startingPrice})`,
        );
      }
    } else if (createOfferDto.amount <= highestOffer) {
      throw new ConflictException(
        `Offer amount must be strictly greater than the current highest offer (${highestOffer})`,
      );
    }

    const offer = this.offersRepository.create({
      ...createOfferDto,
      auction,
      bidder: bidder as User,
    });
    const saved = await this.offersRepository.save(offer);
    return plainToInstance(OfferResponseDto, saved, {
      excludeExtraneousValues: true,
    });
  }

  async findAllForAuction(auctionId: string): Promise<OfferResponseDto[]> {
    const offers = await this.offersRepository.find({
      where: { auction: { id: auctionId } },
      relations: { bidder: true },
      order: { createdAt: 'DESC' },
    });
    return plainToInstance(OfferResponseDto, offers, {
      excludeExtraneousValues: true,
    });
  }

  async getCurrentPrice(auctionId: string): Promise<number> {
    const auction = await this.auctionsService.findOne(auctionId);
    const highestOffer = await this.getHighestOfferAmount(auctionId);
    return highestOffer ?? auction.startingPrice;
  }

  private getHighestOfferAmount(auctionId: string): Promise<number | null> {
    return this.offersRepository.maximum('amount', {
      auction: { id: auctionId },
    });
  }
}
