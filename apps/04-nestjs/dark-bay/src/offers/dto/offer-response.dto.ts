import { Expose, Type } from 'class-transformer';
import { UserSummaryDto } from '../../users/dto/user-summary.dto';

export class OfferResponseDto {
  @Expose()
  id!: string;

  @Expose()
  amount!: number;

  @Expose()
  @Type(() => UserSummaryDto)
  bidder!: UserSummaryDto;

  @Expose()
  createdAt!: Date;
}
