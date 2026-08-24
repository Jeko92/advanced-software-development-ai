import { Controller, Get, UseGuards } from '@nestjs/common';
import { ConcertsService } from '../concerts/concerts.service.ts';
import { QuotesService } from '../quotes/quotes.service.ts';
import { Public } from '../common/decorators/public.decorator.ts';
import { UsersService } from '../users/users.service.ts';
import { IsAdminGuard } from '../common/guards/is-admin.guard.ts';
import { BasicAuthGuard } from '../common/guards/basic-auth.guard.ts';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly quotesService: QuotesService,
    private readonly concertsService: ConcertsService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Get('stats')
  @UseGuards(BasicAuthGuard, IsAdminGuard)
  async getStats() {
    const [quotes, concerts, users] = await Promise.all([
      this.quotesService.findAll(),
      this.concertsService.findAll({ page: 1, limit: 1 }),
      this.usersService.findAll(),
    ]);

    return {
      quotes: quotes.length,
      concerts: concerts.meta.total,
      users: users.length,
    };
  }
}
