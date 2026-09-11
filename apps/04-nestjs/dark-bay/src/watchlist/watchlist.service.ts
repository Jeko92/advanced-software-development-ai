import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Watchlist } from './entities/watchlist.entity';
import { AuctionsService } from '../auctions/auctions.service';
import { AuctionResponseDto } from '../auctions/dto/auction-response.dto';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectRepository(Watchlist)
    private readonly watchlistRepository: Repository<Watchlist>,
    private readonly auctionsService: AuctionsService,
  ) {}

  async add(auctionId: string, userId: string): Promise<void> {
    // Throws NotFoundException if the auction doesn't exist.
    await this.auctionsService.findOne(auctionId);

    const existing = await this.findEntry(auctionId, userId);
    if (existing) {
      throw new ConflictException('This auction is already on your watchlist');
    }

    const entry = this.watchlistRepository.create({
      user: { id: userId },
      auction: { id: auctionId },
    });
    await this.watchlistRepository.save(entry);
  }

  async remove(auctionId: string, userId: string): Promise<void> {
    const existing = await this.findEntry(auctionId, userId);
    if (!existing) {
      throw new NotFoundException('This auction is not on your watchlist');
    }
    await this.watchlistRepository.remove(existing);
  }

  async findAllForUser(userId: string): Promise<AuctionResponseDto[]> {
    const entries = await this.watchlistRepository.find({
      where: { user: { id: userId } },
      relations: { auction: { seller: true } },
      order: { createdAt: 'DESC' },
    });
    const auctions = entries.map((entry) => entry.auction);
    return plainToInstance(AuctionResponseDto, auctions, {
      excludeExtraneousValues: true,
    });
  }

  private findEntry(
    auctionId: string,
    userId: string,
  ): Promise<Watchlist | null> {
    return this.watchlistRepository.findOne({
      where: { auction: { id: auctionId }, user: { id: userId } },
    });
  }
}
