import { Expose, Type } from 'class-transformer';

class AuctionSummaryForOfferDto {
  @Expose()
  id!: string;

  @Expose()
  title!: string;

  @Expose()
  endDate!: Date;
}

export class MyOfferResponseDto {
  @Expose()
  id!: string;

  @Expose()
  amount!: number;

  @Expose()
  createdAt!: Date;

  @Expose()
  isWinning!: boolean;

  @Expose()
  @Type(() => AuctionSummaryForOfferDto)
  auction!: AuctionSummaryForOfferDto;
}
