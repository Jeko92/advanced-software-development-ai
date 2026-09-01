import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './offer.entity';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { AuctionsModule } from '../auctions/auctions.module';

@Module({
  // AuctionsModule is imported for its exported service: bidding rules are
  // checked against a listing, and that lookup stays owned by the auctions module.
  imports: [TypeOrmModule.forFeature([Offer]), AuctionsModule],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
