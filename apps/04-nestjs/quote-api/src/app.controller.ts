import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import nunjucks from 'nunjucks';
import { AppService } from './app.service.ts';
import type { Quote } from './quotes.ts';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  showHomepage(@Res() response: Response, @Query('author') author?: string) {
    const quotes = this.appService.getAllQuotes(author);

    const html = nunjucks.render('home.njk', {
      quotes,
      author,
    });

    response.type('html').send(html);
  }

  @Get('/quotes')
  getAllQuotes(@Query('author') author?: string): Quote[] {
    return this.appService.getAllQuotes(author);
  }

  @Get('/quotes/random')
  getRandomQuote(@Res() response: Response) {
    const quote = this.appService.getRandomQuote();

    const html = nunjucks.render('randomQuote.njk', {
      quote,
    });

    response.type('html').send(html);
  }
}
