import { Module } from '@nestjs/common';
import { AppService } from './app.service.ts';
import { AppController } from './app.controller.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './db/data-source.ts';
import { UsersModule } from './users/users.module.ts';
import { QuotesModule } from './quotes/quotes.module.ts';
import { AuthModule } from './auth/auth.module.ts';
import { SessionModule } from './auth/session/session.module.ts';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard.ts';
import { ConcertsModule } from './concerts/concerts.module.ts';
import { ApiKeysModule } from './api-keys/api-keys.module.ts';
import { PartnersModule } from './partners/partners.module.ts';
import { AdminModule } from './admin/admin.module.ts';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    UsersModule,
    QuotesModule,
    AuthModule,
    SessionModule,
    ConcertsModule,
    ApiKeysModule,
    PartnersModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
