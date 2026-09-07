import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Boardgame } from './boardgame/entities/boardgame.entity.ts';

config({ quiet: true });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: requireEnv('DB_HOST'),
  port: parseInt(requireEnv('DB_PORT'), 10),
  username: requireEnv('DB_USER'),
  password: process.env['DB_PASSWORD'] ?? '',
  database: requireEnv('DB_NAME'),
  entities: [Boardgame],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // Absolutely critical to disable this here
});
