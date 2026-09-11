import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AppDataSource } from './db/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionsModule } from './auctions/auctions.module';
import { OffersModule } from './offers/offers.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { WatchlistModule } from './watchlist/watchlist.module';

// Migrations are only ever loaded via the CLI's `typeorm-ts-node-commonjs`
// runner (see the `migration:*` npm scripts) — requiring the `.ts` migration
// files through Nest's own ts-node runtime hits a require/ESM interop crash,
// and the running app never needs to load them anyway since nothing here
// auto-runs migrations on boot.
const { migrations: _migrations, ...appDataSourceOptions } =
  AppDataSource.options;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => ({ DB_FILE: process.env['DB_FILE'] })],
      cache: true,
    }),
    TypeOrmModule.forRoot(appDataSourceOptions),
    AuctionsModule,
    OffersModule,
    UsersModule,
    AuthModule,
    WatchlistModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
