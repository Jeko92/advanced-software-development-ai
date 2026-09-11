import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { WatchlistService } from './watchlist.service';
import type { RequestWithUser } from '../auth/request-with-user.interface';

@ApiTags('watchlist')
@ApiBearerAuth()
@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @ApiOperation({ summary: 'Add an auction to the current user watchlist' })
  @ApiNotFoundResponse({ description: 'Auction not found' })
  @ApiConflictResponse({ description: 'Auction is already on the watchlist' })
  @Post(':auctionId')
  add(
    @Param('auctionId', ParseUUIDPipe) auctionId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.watchlistService.add(auctionId, req.user.id);
  }

  @ApiOperation({
    summary: 'Remove an auction from the current user watchlist',
  })
  @ApiNotFoundResponse({ description: 'Auction is not on the watchlist' })
  @Delete(':auctionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('auctionId', ParseUUIDPipe) auctionId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.watchlistService.remove(auctionId, req.user.id);
  }

  @ApiOperation({ summary: "List the current user's watched auctions" })
  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.watchlistService.findAllForUser(req.user.id);
  }
}
