import { ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { afterAll, beforeAll, describe, it } from 'vitest';
import { Auction } from './auction.entity';
import request from 'supertest';
import { AuctionsModule } from './auctions.module';
import { Offer } from '../offers/offer.entity';
import { User } from '../users/user.entity';
import { DataSource } from 'typeorm';

describe('AuctionController and AuctionService Integration', () => {
  let app: INestApplication;
  let auction: Auction;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        AuctionsModule,
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [Auction, Offer, User],
          synchronize: true,
        }),
      ],
    }).compile();

    app = module.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    const dataSource = app.get(DataSource);

    const seller = await dataSource.getRepository(User).save({
      email: 'test@example.test',
      passwordHash: '$2b$10$hash',
    });

    auction = await dataSource.getRepository(Auction).save({
      title: 'Vintage lamp',
      description: 'A vintage lamp from the 1920s',
      startingPrice: 20,
      currentPrice: 20,
      endDate: new Date(Date.now() + 86_400_000),
      seller,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('finds all auctions', async () => {
    // use return or await to trigger the request!
    await request(app.getHttpServer())
      .get('/auctions')
      .expect(200)
      .expect({
        data: [
          {
            id: auction.id,
            title: auction.title,
            description: auction.description,
            startingPrice: auction.startingPrice,
            currentPrice: auction.currentPrice,
            endDate: auction.endDate.toISOString(),
            createdAt: auction.createdAt.toISOString(),
            seller: {
              id: auction.seller.id,
              email: auction.seller.email,
            },
          },
        ],
        meta: {
          totalItems: 1,
          totalPages: 1,
          page: 1,
          limit: 10,
        },
      });
  });
});
