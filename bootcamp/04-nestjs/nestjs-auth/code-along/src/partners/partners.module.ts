import { Module } from '@nestjs/common';
import { PartnersController } from './partners.controller';
import { QuotesModule } from '../quotes/quotes.module';
import { ConcertsModule } from '../concerts/concerts.module';
import { ApiKeysModule } from '../api-keys/api-keys.module';
import { ApiKeyGuard } from '../api-keys/api-key.guard';

@Module({
  imports: [QuotesModule, ConcertsModule, ApiKeysModule],
  providers: [ApiKeyGuard],
  controllers: [PartnersController],
})
export class PartnersModule {}
