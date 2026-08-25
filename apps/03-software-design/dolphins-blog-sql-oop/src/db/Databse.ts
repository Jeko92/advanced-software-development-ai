import { Database as SqliteDatabase, open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'node:path';
import fs from 'node:fs';

const DEFAULT_DB_PATH = path.join('db', 'blog.db');

export default class Database {
  private static instance: Database | null = null;
  private connection: SqliteDatabase | null = null;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(): Promise<void> {
    const dbPath = path.resolve(process.env['DB_PATH'] ?? DEFAULT_DB_PATH);

    fs.mkdirSync(path.dirname(dbPath), { recursive: true });

    this.connection = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    console.log('Database connected and tables initialized.');
  }

  getConnection(): SqliteDatabase {
    if (!this.connection) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.connection;
  }

  async close(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
    }
  }
}
