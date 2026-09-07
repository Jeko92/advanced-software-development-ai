// src/data-source.ts
import { DataSource } from 'typeorm';
import { Boardgame } from '../boardgames/entities/boardgame.entity.ts';
import 'dotenv/config';
import { Room } from '../rooms/entities/room.entity.ts';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: process.env['DB_FILE']!,
  entities: [Boardgame, Room],
  migrations: ['src/db/migrations/*.ts'],
  synchronize: false,
});
