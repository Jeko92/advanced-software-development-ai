import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller.ts';
import { QuotesModule } from '../quotes/quotes.module.ts';
import { ConcertsModule } from '../concerts/concerts.module.ts';
import { IsAdminGuard } from '../common/guards/is-admin.guard.ts';
import { UsersModule } from '../users/users.module.ts';
import { AuthModule } from '../auth/auth.module.ts';
import { BasicAuthGuard } from '../common/guards/basic-auth.guard.ts';

@Module({
  imports: [QuotesModule, ConcertsModule, UsersModule, AuthModule],
  providers: [IsAdminGuard, BasicAuthGuard],
  controllers: [AdminController],
})
export class AdminModule {}
