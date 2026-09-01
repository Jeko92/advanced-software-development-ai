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
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuctionsService } from './auctions.service.ts';
import { CreateAuctionDto } from './dto/create-auction.dto.ts';
import { QueryAuctionsDto } from './dto/query-auctions.dto.ts';
import { AuctionResponseDto } from './dto/auction-response.dto.ts';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.ts';
import { CurrentUser } from '../auth/current-user.decorator.ts';
import { User } from '../users/user.entity.ts';
import { ApiPaginatedResponse } from '../common/decorators/api-paginated-response.decorator.ts';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto.ts';

/**
 * The HTTP edge of the auctions module.
 *
 * Every method follows the same three steps: turn the request DTO into the
 * plain types the service speaks, call the service, and map the entities it
 * returns onto response DTOs. Nothing else happens here.
 */
@ApiTags('auctions')
@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  /** Public: anyone can browse the catalogue without a token. */
  @Get()
  @ApiOperation({ summary: 'Browse auctions with filtering and pagination' })
  @ApiPaginatedResponse(AuctionResponseDto)
  async findAll(
    @Query() query: QueryAuctionsDto,
  ): Promise<PaginatedResponseDto<AuctionResponseDto>> {
    const page = await this.auctionsService.findAll({
      ...query.toAuctionQuery(),
      ...query.toPageRequest(),
    });

    return new PaginatedResponseDto(
      page.data.map(AuctionResponseDto.fromEntity),
      {
        totalItems: page.totalItems,
        page: query.page,
        limit: query.limit,
      },
    );
  }

  /**
   * Public. `ParseUUIDPipe` rejects a malformed id with a 400 before the
   * database is touched — an unparseable id is bad syntax, not a missing row.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Fetch a single auction' })
  @ApiOkResponse({ type: AuctionResponseDto })
  @ApiNotFoundResponse({ description: 'No auction with that id.' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AuctionResponseDto> {
    const auction = await this.auctionsService.findOne(id);
    return AuctionResponseDto.fromEntity(auction);
  }

  /**
   * Protected. The guard populates `request.user` from the bearer token, and
   * `@CurrentUser()` hands it to the service — which is why `CreateAuctionDto`
   * has no `seller` field for a client to forge.
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List a new auction (authenticated)' })
  @ApiCreatedResponse({ type: AuctionResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid bearer token.' })
  async create(
    @Body() dto: CreateAuctionDto,
    @CurrentUser() seller: User,
  ): Promise<AuctionResponseDto> {
    const auction = await this.auctionsService.create(dto, seller);
    return AuctionResponseDto.fromEntity(auction);
  }
}
