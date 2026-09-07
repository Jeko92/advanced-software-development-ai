import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'node:path';
import fs from 'node:fs';

// Run via `pnpm run db:seed` (invoked with --env-file=.env so DB_PATH is
// available here, same as the app itself).
const DEFAULT_DB_PATH = path.join('db', 'blog.db');
const dbPath = path.resolve(process.env['DB_PATH'] ?? DEFAULT_DB_PATH);
const seedFilePath = path.join(process.cwd(), 'db', 'seeddb.sql');

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = await open({ filename: dbPath, driver: sqlite3.Database });
const seedSql = fs.readFileSync(seedFilePath, 'utf-8');

await db.exec(seedSql);
await db.close();

console.log(`Seeded ${dbPath} from ${seedFilePath}`);
