import { Expose, Transform, Type } from 'class-transformer';
import { UserSummaryDto } from '../../users/dto/user-summary.dto';
import { getAuctionStatus } from '../../common/utils/auction-status.util';
import type { AuctionStatus } from '../../common/utils/auction-status.util';

export class AuctionResponseDto {
  @Expose()
  id!: string;

  @Expose()
  title!: string;

  @Expose()
  description!: string;

  @Expose()
  startingPrice!: number;

  @Expose()
  endDate!: Date;

  @Expose()
  @Transform(({ obj }: { obj: { endDate: Date } }) =>
    getAuctionStatus(obj.endDate),
  )
  status!: AuctionStatus;

  @Expose()
  @Type(() => UserSummaryDto)
  seller!: UserSummaryDto;

  @Expose()
  createdAt!: Date;
}
