import {
  Controller,
  Delete,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Query,
  Request,
  SerializeOptions,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { AuctionResponseDto } from './dto/auction-response.dto';
import { AuctionQueryDto } from './dto/auction-query.dto';
import { Public } from '../common/decorators/public.decorator';
import type { RequestWithUser } from '../auth/request-with-user.interface';

@ApiTags('auctions')
@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new auction' })
  @Post()
  create(
    @Body() createAuctionDto: CreateAuctionDto,
    @Request() req: RequestWithUser,
  ) {
    return this.auctionsService.create(createAuctionDto, {
      id: req.user.id,
      username: req.user.username,
    });
  }

  @ApiOperation({ summary: 'List auctions with pagination and filtering' })
  @Public()
  @Get()
  findAll(@Query() query: AuctionQueryDto) {
    return this.auctionsService.findAll(query);
  }

  @ApiOperation({ summary: 'Get an auction by id' })
  @ApiNotFoundResponse({ description: 'Auction not found' })
  @Public()
  @Get(':id')
  @SerializeOptions({ type: AuctionResponseDto })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.auctionsService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an auction (owner or admin only)' })
  @ApiNotFoundResponse({ description: 'Auction not found' })
  @ApiForbiddenResponse({
    description: 'Only the auction owner or an admin can delete this auction',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: RequestWithUser,
  ) {
    return this.auctionsService.remove(id, req.user);
  }
}
