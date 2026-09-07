import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Quote } from '../quotes/entities/quote.entity';
import { Session } from '../auth/session/entities/session.entity';
import { Concert } from '../concerts/entities/concert.entity';
import { ApiKey } from '../api-keys/entities/api-key.entity';

config({ quiet: true });

const dbFile = process.env['DB_FILE'];
if (!dbFile) {
  throw new Error('Missing required environment variable: DB_FILE');
}

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: dbFile,
  entities: [User, Quote, Session, Concert, ApiKey],
  migrations: ['src/db/migrations/*.ts'],
  synchronize: false,
});
