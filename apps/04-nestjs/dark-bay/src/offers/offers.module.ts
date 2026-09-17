import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { MyOffersController } from './my-offers.controller';
import { Offer } from './entities/offer.entity';
import { AuctionsModule } from '../auctions/auctions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Offer]), AuctionsModule],
  controllers: [OffersController, MyOffersController],
  providers: [OffersService],
})
export class OffersModule {}
