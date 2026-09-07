import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ConcertsService } from '../concerts/concerts.service';
import { QuotesService } from '../quotes/quotes.service';
import { Public } from '../common/decorators/public.decorator';
import { ApiKeyGuard } from '../api-keys/api-key.guard';
import { PaginationQueryDto } from '../concerts/dto/pagination-query.dto';

@Controller('partners')
export class PartnersController {
  constructor(
    private readonly quotesService: QuotesService,
    private readonly concertsService: ConcertsService,
  ) {}

  @Public()
  @UseGuards(ApiKeyGuard)
  @Get('quotes')
  getAllQuotes() {
    return this.quotesService.findAll();
  }

  @Public()
  @UseGuards(ApiKeyGuard)
  @Get('concerts')
  getAllConcerts(@Query() pagination: PaginationQueryDto) {
    return this.concertsService.findAll(pagination);
  }
}
