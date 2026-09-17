import { Expose, Transform, Type } from 'class-transformer';
import { UserSummaryDto } from '../../users/dto/user-summary.dto';
import { getAuctionStatus } from '../../common/utils/auction-status.util';
import type { AuctionStatus } from '../../common/utils/auction-status.util';
import type { Offer } from '../../offers/entities/offer.entity';

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

  // The highest offer so far, or startingPrice if there are none yet.
  //
  // ClassSerializerInterceptor runs this transform twice per request: once
  // converting the raw entity to this DTO (where `offers` is populated, if
  // the caller loaded the relation), then again converting the resulting
  // DTO instance to a plain object for the response (where `offers` was
  // never copied over, since it isn't its own @Expose()d field). On that
  // second pass, `value` already holds what the first pass computed, so we
  // pass it through unchanged instead of recomputing from a missing
  // relation and clobbering the real answer with startingPrice.
  @Expose()
  @Transform(
    ({
      value,
      obj,
    }: {
      value: number | undefined;
      obj: { startingPrice: number; offers?: Offer[] };
    }) => {
      if (obj.offers) {
        return obj.offers.length > 0
          ? Math.max(...obj.offers.map((offer) => offer.amount))
          : obj.startingPrice;
      }
      return value ?? obj.startingPrice;
    },
  )
  currentPrice!: number;

  @Expose()
  @Type(() => UserSummaryDto)
  seller!: UserSummaryDto;

  @Expose()
  createdAt!: Date;
}
