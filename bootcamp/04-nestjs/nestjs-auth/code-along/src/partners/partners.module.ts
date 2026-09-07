import { Module } from '@nestjs/common';
import { PartnersController } from './partners.controller.ts';
import { QuotesModule } from '../quotes/quotes.module.ts';
import { ConcertsModule } from '../concerts/concerts.module.ts';
import { ApiKeysModule } from '../api-keys/api-keys.module.ts';
import { ApiKeyGuard } from '../api-keys/api-key.guard.ts';

@Module({
  imports: [QuotesModule, ConcertsModule, ApiKeysModule],
  providers: [ApiKeyGuard],
  controllers: [PartnersController],
})
export class PartnersModule {}
