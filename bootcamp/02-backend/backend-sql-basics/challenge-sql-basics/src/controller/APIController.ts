import type { Request, Response } from 'express';
import * as postModel from '../models/postModel';
import { closeDB } from '../db/database';

export async function getAllPosts(_req: Request, res: Response) {
  const posts = await postModel.getAllPosts();

  res.json(posts);
}

export async function getPostById(req: Request<{ id: string }>, res: Response) {
  const post = await postModel.getPostById(Number(req.params.id));

  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  res.json(post);
}

export async function handleShutdown(signalName: string): Promise<void> {
  console.log(`Received signal: ${signalName}`);
  const forceExit = setTimeout(() => {
    console.error('Graceful shutdown timed out — forcing exit.');
    process.exit(1);
  }, 5000).unref();
  try {
    await closeDB();
    console.log('Database connection closed successfully.');
  } catch (err) {
    console.error(`Error closing database: ${err}`);
  } finally {
    clearTimeout(forceExit);
    process.exit(0);
  }
}
