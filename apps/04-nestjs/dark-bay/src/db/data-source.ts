import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Auction } from '../auctions/entities/auction.entity';
import { Offer } from '../offers/entities/offer.entity';
import { User } from '../users/entities/user.entity';
import { Watchlist } from '../watchlist/entities/watchlist.entity';

config({ quiet: true });

const databaseUrl = process.env['DATABASE_URL'];
if (!databaseUrl) {
  throw new Error('Missing required environment variable: DATABASE_URL');
}

// Prefer Render's Internal Database URL for the deployed app: internal
// connections stay on Render's private network and don't need SSL at all
// (leave DATABASE_SSL unset). Only set DATABASE_SSL=true for an external
// connection (e.g. connecting from outside Render, like a local machine).
//
// When SSL is on, verify by default — pass DATABASE_CA_CERT (the
// provider's CA bundle, PEM text) to enable that. Skipping verification
// entirely is a separate, explicit opt-in (DATABASE_SSL_INSECURE=true)
// rather than something DATABASE_SSL=true does implicitly, since trading
// away MITM protection shouldn't be the default behavior of "turn SSL on".
const useSsl = process.env['DATABASE_SSL'] === 'true';
const caCert = process.env['DATABASE_CA_CERT'];
const insecureSsl = process.env['DATABASE_SSL_INSECURE'] === 'true';

if (useSsl && !caCert && insecureSsl) {
  console.warn(
    'DATABASE_SSL_INSECURE=true: connecting to Postgres over SSL without ' +
      'verifying the server certificate. Set DATABASE_CA_CERT instead once ' +
      "you have the provider's CA bundle.",
  );
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  ssl: useSsl
    ? { ca: caCert, rejectUnauthorized: caCert ? true : !insecureSsl }
    : false,
  entities: [Auction, Offer, User, Watchlist],
  migrations: ['src/db/migrations/*.ts'],
  synchronize: false,
});
