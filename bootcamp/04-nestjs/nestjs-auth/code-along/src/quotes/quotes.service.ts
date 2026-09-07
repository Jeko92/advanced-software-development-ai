import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Quote } from './entities/quote.entity';
import { plainToInstance } from 'class-transformer';
import { QuoteResponseDto } from './dto/quote-response.dto';

@Injectable()
export class QuotesService {
  @InjectRepository(Quote)
  private readonly quotes!: Repository<Quote>;

  private findQuoteEntity(id: string) {
    return this.quotes.findOne({
      where: { id },
    });
  }

  async create(body: CreateQuoteDto) {
    const quote = this.quotes.create(body);
    const savedQuote = await this.quotes.save(quote);
    return plainToInstance(QuoteResponseDto, savedQuote, {
      excludeExtraneousValues: true,
    });
  }

  async findAll() {
    const quotes = await this.quotes.find();

    return plainToInstance(QuoteResponseDto, quotes, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string) {
    const quote = await this.findQuoteEntity(id);

    if (!quote) {
      throw new NotFoundException(`Quote with id ${id} not found.`);
    }

    return plainToInstance(QuoteResponseDto, quote, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, body: UpdateQuoteDto) {
    const quote = await this.findQuoteEntity(id);

    if (!quote) {
      throw new NotFoundException(`Quote with id ${id} not found.`);
    }

    Object.assign(quote, body);

    const updatedQuote = await this.quotes.save(quote);

    return plainToInstance(QuoteResponseDto, updatedQuote, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string) {
    const result = await this.quotes.delete(id);
    if ((result.affected ?? 0) === 0) {
      throw new NotFoundException(`Quote with id ${id} not found.`);
    }
  }
}
