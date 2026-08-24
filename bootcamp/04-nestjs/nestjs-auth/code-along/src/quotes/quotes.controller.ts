import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.ts';
import { QuotesService } from './quotes.service.ts';
import { CreateQuoteDto } from './dto/create-quote.dto.ts';
import { UpdateQuoteDto } from './dto/update-quote.dto.ts';
import { Public } from '../common/decorators/public.decorator.ts';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createQuoteDto: CreateQuoteDto) {
    return this.quotesService.create(createQuoteDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.quotesService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuoteDto: UpdateQuoteDto) {
    return this.quotesService.update(id, updateQuoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quotesService.remove(id);
  }
}
