// src/db/data-source.ts
import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Thread } from '../threads/entities/threads.entity.ts';
import { Comment } from '../comments/entities/comments.entity.ts';

config({ quiet: true });

const dbFile = process.env['DB_FILE'];
if (!dbFile) {
  throw new Error('Missing required environment variable: DB_FILE');
}

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: dbFile,
  entities: [Thread, Comment],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
