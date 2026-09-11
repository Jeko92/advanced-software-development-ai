import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Auction } from '../auctions/entities/auction.entity';
import { Offer } from '../offers/entities/offer.entity';
import { User } from '../users/entities/user.entity';
import { Watchlist } from '../watchlist/entities/watchlist.entity';

config({ quiet: true });

const dbFile = process.env['DB_FILE'];
if (!dbFile) {
  throw new Error('Missing required environment variable: DB_FILE');
}

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: dbFile,
  entities: [Auction, Offer, User, Watchlist],
  migrations: ['src/db/migrations/*.ts'],
  synchronize: false,
  enableWAL: true,
});
