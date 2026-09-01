import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from './auction.entity.ts';
import { AuctionsService } from './auctions.service.ts';
import { AuctionsController } from './auctions.controller.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Auction])],
  controllers: [AuctionsController],
  providers: [AuctionsService],
  // The offers module validates bids against a listing, so it needs the
  // service — but not the repository. Exporting only the service keeps every
  // rule about auctions inside this module.
  exports: [AuctionsService],
})
export class AuctionsModule {}
