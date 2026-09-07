import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Thread } from '../threads/entities/threads.entity';
import { Comment } from '../comments/entities/comments.entity';
import { User } from '../users/entities/user.entity';

config({ quiet: true });

const dbFile = process.env['DB_FILE'];
if (!dbFile) {
  throw new Error('Missing required environment variable: DB_FILE');
}

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: dbFile,
  entities: [Thread, Comment, User],
  migrations: ['src/db/migrations/*.ts'],
  synchronize: false,
  logging: false,
  enableWAL: true,
});
