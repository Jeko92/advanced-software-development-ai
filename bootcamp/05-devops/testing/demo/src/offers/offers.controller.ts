import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { OffersService } from './offers.service.ts';
import { CreateOfferDto } from './dto/create-offer.dto.ts';
import { OfferResponseDto } from './dto/offer-response.dto.ts';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.ts';
import { CurrentUser } from '../auth/current-user.decorator.ts';
import { User } from '../users/user.entity.ts';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto.ts';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto.ts';
import { ApiPaginatedResponse } from '../common/decorators/api-paginated-response.decorator.ts';

/**
 * Offers are nested under the auction they belong to.
 *
 * A bid has no meaning on its own, so the URL says which listing it is against
 * and the body carries only the amount — there is no second copy of the
 * auction id that could contradict the path.
 */
@ApiTags('offers')
@Controller('auctions/:auctionId/offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  /** Public: the bid history is part of what makes a listing worth watching. */
  @Get()
  @ApiOperation({ summary: 'List the bid history for an auction' })
  @ApiPaginatedResponse(OfferResponseDto)
  @ApiNotFoundResponse({ description: 'No auction with that id.' })
  async findByAuction(
    @Param('auctionId', ParseUUIDPipe) auctionId: string,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<OfferResponseDto>> {
    // There are no filters here, so only the pagination half of the query
    // string has to be handed on.
    const page = await this.offersService.findByAuction(
      auctionId,
      query.toPageRequest(),
    );

    return new PaginatedResponseDto(
      page.data.map(OfferResponseDto.fromEntity),
      {
        totalItems: page.totalItems,
        page: query.page,
        limit: query.limit,
      },
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Place a bid on an auction (authenticated)' })
  @ApiCreatedResponse({ type: OfferResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid bearer token.' })
  @ApiForbiddenResponse({ description: 'You cannot bid on your own auction.' })
  @ApiConflictResponse({
    description:
      'The auction has closed, or the bid does not beat the current price.',
  })
  @ApiNotFoundResponse({ description: 'No auction with that id.' })
  async create(
    @Param('auctionId', ParseUUIDPipe) auctionId: string,
    @Body() dto: CreateOfferDto,
    @CurrentUser() bidder: User,
  ): Promise<OfferResponseDto> {
    console.log(bidder);
    const offer = await this.offersService.create(auctionId, dto, bidder);
    return OfferResponseDto.fromEntity(offer);
  }
}
