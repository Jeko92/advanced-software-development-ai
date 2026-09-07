import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'node:path';
import { sql } from './sql.ts';

const DB_FILE = process.env['DB_PATH']
  ? path.resolve(process.env['DB_PATH'])
  : path.join(process.cwd(), 'db', 'blogPostings.db');

let db: Database | null = null;

export async function connectToDatabase() {
  db = await open({ filename: DB_FILE, driver: sqlite3.Database });

  await db.exec(sql`
    CREATE TABLE IF NOT EXISTS posting (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL
    )
  `);

  console.log('Database connected and tables initialized.');
  return db;
}

export function getDatabase(): Database {
  if (!db) {
    throw new Error('Database not connected. Call connectToDatabase() first.');
  }
  return db;
}

export async function closeDatabase() {
  if (db) {
    await db.close();
    db = null;
  }
}
