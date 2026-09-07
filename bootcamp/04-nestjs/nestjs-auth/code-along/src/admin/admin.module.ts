import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { QuotesModule } from '../quotes/quotes.module';
import { ConcertsModule } from '../concerts/concerts.module';
import { IsAdminGuard } from '../common/guards/is-admin.guard';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { BasicAuthGuard } from '../common/guards/basic-auth.guard';

@Module({
  imports: [QuotesModule, ConcertsModule, UsersModule, AuthModule],
  providers: [IsAdminGuard, BasicAuthGuard],
  controllers: [AdminController],
})
export class AdminModule {}
