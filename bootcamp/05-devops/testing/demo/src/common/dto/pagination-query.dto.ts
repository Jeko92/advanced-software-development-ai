import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import type { PageRequest } from '../types/page.type';

/**
 * Base class for any paginated list endpoint.
 *
 * Query strings are always text, so `page=2` arrives as the string `"2"`.
 * `@Type(() => Number)` tells class-transformer to convert it before the
 * validators run — otherwise `@IsInt()` would reject every request.
 */
export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Page number, starting at 1.',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page.',
    minimum: 1,
    maximum: 100,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  /**
   * Translates the client's "page 2" into the `offset` a database understands.
   *
   * This is the whole reason services take a `PageRequest` instead of this DTO:
   * page-vs-offset arithmetic is a detail of the HTTP layer, and doing it here
   * means no service ever has to repeat it.
   */
  toPageRequest(): PageRequest {
    return {
      offset: (this.page - 1) * this.limit,
      limit: this.limit,
    };
  }
}
