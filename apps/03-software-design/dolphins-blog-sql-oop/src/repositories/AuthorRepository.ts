import Database from '../db/Databse.ts';
import type { IAuthorRepository } from './IAuthorRepository.ts';
import type { Author } from '../entities/Author.ts';

export class AuthorRepository implements IAuthorRepository {
  constructor(private readonly database: Database) {}

  async loadAuthors(): Promise<Author[]> {
    return this.database
      .getConnection()
      .all<Author[]>('SELECT * FROM authors ORDER BY name ASC');
  }

  async getAuthorById(id: number): Promise<Author | undefined> {
    return this.database
      .getConnection()
      .get<Author>('SELECT * FROM authors WHERE id = ?', id);
  }

  async createAuthor(name: string): Promise<number> {
    const result = await this.database
      .getConnection()
      .run('INSERT INTO authors (name) VALUES (?)', name);

    if (result.lastID === undefined) {
      throw new Error('Failed to determine the new author id');
    }

    return result.lastID;
  }

  async updateAuthor(id: number, name: string): Promise<void> {
    const result = await this.database
      .getConnection()
      .run('UPDATE authors SET name = ? WHERE id = ?', name, id);

    if (!result.changes) {
      throw new Error(`Author with id ${id} not found`);
    }
  }

  async deleteAuthor(id: number): Promise<void> {
    const result = await this.database
      .getConnection()
      .run('DELETE FROM authors WHERE id = ?', id);

    if (!result.changes) {
      throw new Error(`Author with id ${id} not found`);
    }
  }
}
