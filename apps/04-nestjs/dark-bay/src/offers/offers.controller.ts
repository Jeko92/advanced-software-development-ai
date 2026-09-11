import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferResponseDto } from './dto/offer-response.dto';
import { Public } from '../common/decorators/public.decorator';
import type { RequestWithUser } from '../auth/request-with-user.interface';

@ApiTags('offers')
@Controller('auctions/:auctionId/offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Place a bid on an auction' })
  @ApiNotFoundResponse({ description: 'Auction not found' })
  @ApiForbiddenResponse({
    description: 'Sellers cannot bid on their own auctions',
  })
  @ApiConflictResponse({
    description: 'Auction is closed, or the bid does not meet the price rules',
  })
  @Post()
  placeOffer(
    @Param('auctionId') auctionId: string,
    @Body() createOfferDto: CreateOfferDto,
    @Request() req: RequestWithUser,
  ): Promise<OfferResponseDto> {
    return this.offersService.placeOffer(auctionId, createOfferDto, {
      id: req.user.id,
      username: req.user.username,
    });
  }

  @ApiOperation({ summary: 'List the bid history for an auction' })
  @Public()
  @Get()
  findAllForAuction(
    @Param('auctionId') auctionId: string,
  ): Promise<OfferResponseDto[]> {
    return this.offersService.findAllForAuction(auctionId);
  }
}
