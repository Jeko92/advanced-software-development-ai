import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration } from './config/configuration.ts';
import { UsersModule } from './users/users.module.ts';
import { AuthModule } from './auth/auth.module.ts';
import { AuctionsModule } from './auctions/auctions.module.ts';
import { OffersModule } from './offers/offers.module.ts';

@Module({
  imports: [
    ConfigModule.forRoot({
      // Global, so no other module has to import ConfigModule just to read a value.
      isGlobal: true,
      load: [configuration],
    }),
    /**
     * `forRootAsync` because the database path comes from configuration, which
     * is a provider and therefore only available through dependency injection.
     *
     * Two options carry most of the weight here:
     *  - `autoLoadEntities` picks up every entity registered with
     *    `TypeOrmModule.forFeature()`, so adding an entity never means editing
     *    a central list that someone will forget.
     *  - `synchronize` makes TypeORM reshape the schema to match the entities
     *    on every startup. That is exactly what you want while the model is
     *    still moving, and exactly what you must never ship: it will happily
     *    drop a column, and the data in it, to make the schema match. In
     *    production this goes off and migrations take over.
     */
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'better-sqlite3' as const,
        database: configService.get<string>('DATABASE_PATH', 'darkbay.sqlite'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
    AuctionsModule,
    OffersModule,
  ],
})
export class AppModule {}
