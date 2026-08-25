import type { Author } from '../entities/Author.ts';

export interface IAuthorRepository {
  loadAuthors(): Promise<Author[]>;
  getAuthorById(id: number): Promise<Author | undefined>;
  createAuthor(name: string): Promise<number>;
  updateAuthor(id: number, name: string): Promise<void>;
  deleteAuthor(id: number): Promise<void>;
}
