import type { Request, Response } from 'express';
import * as authorModel from '../models/authorModel.ts';

export async function getAllAuthors(_req: Request, res: Response) {
  try {
    const authors = await authorModel.getAllAuthorsWithProfiles();
    res.status(200).json(authors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch authors' });
  }
}
