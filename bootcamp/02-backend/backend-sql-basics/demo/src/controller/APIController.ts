import type { Request, Response } from 'express';
import * as blogModel from '../models/blogModel.ts';
import allBlogsResponse from '../views/api/allBlogsResponse.ts';
import { closeDatabase } from '../db/database.ts';

export async function getAllBlogs(_req: Request, res: Response) {
  const blogs = await blogModel.getAllBlogsPostings();

  res.json(allBlogsResponse(blogs));
}

export async function getBlogById(req: Request<{ id: string }>, res: Response) {
  const blog = await blogModel.getBlogPostingById(Number(req.params.id));

  if (!blog) {
    res.status(404).json({ error: 'Blog not found' });
    return;
  }

  res.json(blog);
}

export async function handleShutdown(signalName: string): Promise<void> {
  console.log(`Received signal: ${signalName}`);
  const forceExit = setTimeout(() => {
    console.error('Graceful shutdown timed out — forcing exit.');
    process.exit(1);
  }, 5000).unref();
  try {
    await closeDatabase();
    console.log('Database connection closed successfully.');
  } catch (err) {
    console.error(`Error closing database: ${err}`);
  } finally {
    clearTimeout(forceExit);
    process.exit(0);
  }
}
