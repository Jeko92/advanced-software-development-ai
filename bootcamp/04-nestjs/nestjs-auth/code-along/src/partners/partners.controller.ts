import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ConcertsService } from '../concerts/concerts.service.ts';
import { QuotesService } from '../quotes/quotes.service.ts';
import { Public } from '../common/decorators/public.decorator.ts';
import { ApiKeyGuard } from '../api-keys/api-key.guard.ts';
import { PaginationQueryDto } from '../concerts/dto/pagination-query.dto.ts';

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
