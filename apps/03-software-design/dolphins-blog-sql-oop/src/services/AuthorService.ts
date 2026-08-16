import type { IAuthorRepository } from '../repositories/IAuthorRepository.ts';
import type { Author } from '../entities/Author.ts';

// Thin pass-through — no extra business logic beyond the DB calls, but
// still worth having, for symmetry and so the controller never talks to a
// repository directly.
export class AuthorService {
  constructor(private readonly authorRepository: IAuthorRepository) {}

  async loadAuthors(): Promise<Author[]> {
    return this.authorRepository.loadAuthors();
  }

  async getAuthorById(id: number): Promise<Author | undefined> {
    return this.authorRepository.getAuthorById(id);
  }

  async createAuthor(name: string): Promise<number> {
    return this.authorRepository.createAuthor(name);
  }

  async updateAuthor(id: number, name: string): Promise<void> {
    await this.authorRepository.updateAuthor(id, name);
  }

  async deleteAuthor(id: number): Promise<void> {
    await this.authorRepository.deleteAuthor(id);
  }
}
