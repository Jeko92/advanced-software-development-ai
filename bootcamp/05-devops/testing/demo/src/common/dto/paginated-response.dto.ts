import { ApiProperty } from '@nestjs/swagger';

/** The bookkeeping a client needs to render "page 2 of 7". */
export class PaginationMetaDto {
  @ApiProperty({
    description: 'Total number of items matching the filters.',
    example: 42,
  })
  totalItems!: number;

  @ApiProperty({ description: 'Total number of pages available.', example: 5 })
  totalPages!: number;

  @ApiProperty({ description: 'The page that was returned.', example: 1 })
  page!: number;

  @ApiProperty({ description: 'The page size that was applied.', example: 10 })
  limit!: number;
}

/** The three numbers the envelope needs in order to work out the rest. */
export type PaginationData = {
  totalItems: number;
  page: number;
  limit: number;
};

/**
 * Envelope for every list endpoint.
 *
 * `T` is only a compile-time hint — Swagger cannot see generics at runtime,
 * which is why list endpoints are documented with the `@ApiPaginatedResponse`
 * decorator instead of a plain `@ApiOkResponse`.
 *
 * Built in the controller: `totalItems` comes from the service's `Page`, while
 * `page` and `limit` come from the request the client sent.
 */
export class PaginatedResponseDto<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;

  constructor(data: T[], { totalItems, page, limit }: PaginationData) {
    this.data = data;
    this.meta = {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      page,
      limit,
    };
  }
}
