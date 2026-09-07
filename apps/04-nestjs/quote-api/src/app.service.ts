import { Injectable, NotFoundException } from '@nestjs/common';
import { quotes, type Quote } from './quotes.ts';

@Injectable()
export class AppService {
  private readonly quotesList: Quote[] = quotes;

  private normalizeAuthor(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, '-');
  }

  getAllQuotes(author?: string): Quote[] {
    if (!author) {
      return this.quotesList;
    }

    const searchTerm = this.normalizeAuthor(author);

    return this.quotesList.filter((quote) =>
      this.normalizeAuthor(quote.author).includes(searchTerm),
    );
  }

  getRandomQuote(): Quote {
    if (this.quotesList.length === 0) {
      throw new NotFoundException('No quotes available.');
    }

    const randomIndex = Math.floor(Math.random() * this.quotesList.length);
    const selectedQuote = this.quotesList[randomIndex];

    if (!selectedQuote) {
      throw new NotFoundException('Quote not found.');
    }

    return selectedQuote;
  }
}
