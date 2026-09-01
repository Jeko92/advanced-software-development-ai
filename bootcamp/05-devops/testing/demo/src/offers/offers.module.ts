import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './offer.entity.ts';
import { OffersService } from './offers.service.ts';
import { OffersController } from './offers.controller.ts';
import { AuctionsModule } from '../auctions/auctions.module.ts';

@Module({
  // AuctionsModule is imported for its exported service: bidding rules are
  // checked against a listing, and that lookup stays owned by the auctions module.
  imports: [TypeOrmModule.forFeature([Offer]), AuctionsModule],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
