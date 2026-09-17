import { Controller, Get, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OffersService } from './offers.service';
import { MyOfferResponseDto } from './dto/my-offer-response.dto';
import type { RequestWithUser } from '../auth/request-with-user.interface';

// Separate top-level controller (rather than a method on OffersController)
// because that controller's base path is scoped to a single auction
// (`auctions/:auctionId/offers`) — this route spans all of the current
// user's auctions instead.
@ApiTags('offers')
@ApiBearerAuth()
@Controller('offers')
export class MyOffersController {
  constructor(private readonly offersService: OffersService) {}

  @ApiOperation({ summary: "List the current user's placed bids" })
  @Get('mine')
  findMine(@Request() req: RequestWithUser): Promise<MyOfferResponseDto[]> {
    return this.offersService.findAllForBidder(req.user.id);
  }
}
