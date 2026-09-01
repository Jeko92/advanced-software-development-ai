import { applyDecorators } from '@nestjs/common';
import type { Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import {
  PaginatedResponseDto,
  PaginationMetaDto,
} from '../dto/paginated-response.dto.ts';

/**
 * Swagger builds its schema from decorator metadata, and TypeScript generics
 * are erased before that metadata exists — so `PaginatedResponseDto<AuctionDto>`
 * would document `data` as an untyped array.
 *
 * This composed decorator solves that by describing the envelope by hand and
 * pointing `data` at the concrete model with `getSchemaPath()`.
 */
export const ApiPaginatedResponse = <TModel extends Type<unknown>>(
  model: TModel,
) =>
  applyDecorators(
    ApiExtraModels(PaginatedResponseDto, PaginationMetaDto, model),
    ApiOkResponse({
      description: 'A page of results plus its pagination metadata.',
      schema: {
        allOf: [
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              meta: { $ref: getSchemaPath(PaginationMetaDto) },
            },
          },
        ],
      },
    }),
  );
