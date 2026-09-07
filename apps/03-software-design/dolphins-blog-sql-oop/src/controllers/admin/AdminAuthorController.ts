import type { Request, Response } from 'express';
import type { AuthorService } from '../../services/AuthorService.ts';

export class AdminAuthorController {
  constructor(private readonly authorService: AuthorService) {}

  getAdminAuthors = async (_req: Request, res: Response): Promise<void> => {
    const authors = await this.authorService.loadAuthors();
    res.render('admin/authors.njk', { authors });
  };

  createAuthorHandler = async (req: Request, res: Response): Promise<void> => {
    const { name } = req.body || {};

    if (!name) {
      res.status(400).send('Name is required');
      return;
    }

    try {
      await this.authorService.createAuthor(name);
      res.redirect('/admin/authors');
    } catch (err) {
      const authors = await this.authorService.loadAuthors();
      res.status(500).render('admin/authors.njk', {
        authors,
        error: (err as Error).message,
      });
    }
  };

  deleteAuthorHandler = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).send('Invalid id');
      return;
    }

    try {
      await this.authorService.deleteAuthor(id);
    } catch (err) {
      console.error(`Failed to delete author ${id}:`, err);
    }

    res.redirect('/admin/authors');
  };
}
