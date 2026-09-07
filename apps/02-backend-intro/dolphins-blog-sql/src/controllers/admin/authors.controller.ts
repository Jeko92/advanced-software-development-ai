import type { Request, Response } from 'express';
import {
  loadAuthors,
  createAuthor,
  deleteAuthor,
} from '../../models/author.model.ts';

export async function getAdminAuthors(
  _req: Request,
  res: Response,
): Promise<void> {
  const authors = await loadAuthors();
  res.render('admin/authors.njk', { authors });
}

export async function createAuthorHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const { name } = req.body || {};

  if (!name) {
    res.status(400).send('Name is required');
    return;
  }

  try {
    await createAuthor(name);
    res.redirect('/admin/authors');
  } catch (err) {
    const authors = await loadAuthors();
    res.status(500).render('admin/authors.njk', {
      authors,
      error: (err as Error).message,
    });
  }
}

export async function deleteAuthorHandler(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).send('Invalid id');
    return;
  }

  try {
    await deleteAuthor(id);
  } catch (err) {
    console.error(`Failed to delete author ${id}:`, err);
  }

  res.redirect('/admin/authors');
}
