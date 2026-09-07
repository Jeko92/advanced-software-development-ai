import type { Request, Response } from 'express';
import { loadPosts } from '../../models/post.model.ts';

/**
 * GET /api/posts/random
 * Returns a single random post in JSON format
 */
export async function getRandomPost(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const posts = await loadPosts();

    if (posts.length === 0) {
      res.status(404).json({ error: 'No posts available' });
      return;
    }

    const randomIndex = Math.floor(Math.random() * posts.length);
    const randomPost = posts[randomIndex];

    res.json(randomPost);
  } catch (err) {
    console.error('Failed to retrieve random post:', err);
    res.status(500).json({ error: 'Failed to retrieve random post' });
  }
}

/**
 * GET /api/posts/latest
 * Returns the most recently created post
 */
export async function getLatestPost(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const posts = await loadPosts();

    if (posts.length === 0) {
      res.status(404).json({ error: 'No posts available' });
      return;
    }

    // Sort descending by createdAt timestamp
    const sortedPosts = [...posts].sort((a, b) => b.createdAt - a.createdAt);
    const latestPost = sortedPosts[0];

    res.json(latestPost);
  } catch (err) {
    console.error('Failed to retrieve latest post:', err);
    res.status(500).json({ error: 'Failed to retrieve latest post' });
  }
}

/**
 * GET /api/posts/stats
 * Returns statistics about posts (total count, author counts, average length, etc.)
 */
export async function getPostStats(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const posts = await loadPosts();

    const totalPosts = posts.length;

    // Calculate unique authors and count per author
    const authorCounts: Record<string, number> = {};
    let totalContentLength = 0;

    for (const post of posts) {
      authorCounts[post.author] = (authorCounts[post.author] || 0) + 1;
      totalContentLength += (post.content || '').length;
    }

    const averageContentLength =
      totalPosts > 0 ? Math.round(totalContentLength / totalPosts) : 0;

    res.json({
      totalPosts,
      averageContentLength,
      authorCounts,
    });
  } catch (err) {
    console.error('Failed to calculate post statistics:', err);
    res.status(500).json({ error: 'Failed to calculate post statistics' });
  }
}
