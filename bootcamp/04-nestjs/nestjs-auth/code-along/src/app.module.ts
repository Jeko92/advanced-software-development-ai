import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './db/data-source';
import { UsersModule } from './users/users.module';
import { QuotesModule } from './quotes/quotes.module';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './auth/session/session.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ConcertsModule } from './concerts/concerts.module';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { PartnersModule } from './partners/partners.module';
import { AdminModule } from './admin/admin.module';

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
