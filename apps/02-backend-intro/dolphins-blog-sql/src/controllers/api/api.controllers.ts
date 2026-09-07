import type { Request, Response } from 'express';
import {
  loadPosts,
  createBlogEntry,
  updateBlogEntry,
  deleteBlogEntry,
  loadPostsWithAuthors,
} from '../../models/post.model.ts';
import type { Post } from '../../models/post.model.ts';

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

/**
 * GET /api/posts/with-authors
 * Challenges.md #2: SELECT with a JOIN, each post alongside its author's name.
 */
export async function getPostsWithAuthorsHandler(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const posts = await loadPostsWithAuthors();
    res.json(posts);
  } catch (err) {
    console.error('Failed to retrieve posts with authors:', err);
    res.status(500).json({ error: 'Failed to retrieve posts with authors' });
  }
}

/**
 * POST /api/posts
 * Challenges.md #1: create, parameterized, returns the new post's id.
 */
export async function createBlogEntryHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { title, author, teaser, content, image } = req.body || {};

    if (!title || !author) {
      res.status(400).json({ error: 'title and author are required' });
      return;
    }

    const id = await createBlogEntry({
      title,
      author,
      teaser: teaser || '',
      content: content || '',
      image: image || '',
      createdAt: Math.floor(Date.now() / 1000),
    });

    res.status(201).json({ id });
  } catch (err) {
    console.error('Failed to create post:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
}

/**
 * PUT /api/posts/:id
 * Challenges.md #1: update scoped to a specific id, parameterized.
 */
export async function updateBlogEntryHandler(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({ error: 'Invalid id' });
      return;
    }

    const { title, author, teaser, content, image } = req.body || {};

    // Only include fields the client actually sent — spreading `undefined`
    // values into the merge in updateBlogEntry() would otherwise overwrite
    // existing NOT NULL columns and fail the update.
    const changes: Partial<
      Pick<Post, 'title' | 'author' | 'teaser' | 'content' | 'image'>
    > = {};
    if (title !== undefined) changes.title = title;
    if (author !== undefined) changes.author = author;
    if (teaser !== undefined) changes.teaser = teaser;
    if (content !== undefined) changes.content = content;
    if (image !== undefined) changes.image = image;

    await updateBlogEntry(id, changes);
    res.status(200).json({ id });
  } catch (err) {
    if ((err as Error).message.includes('not found')) {
      res.status(404).json({ error: (err as Error).message });
      return;
    }
    console.error('Failed to update post:', err);
    res.status(500).json({ error: 'Failed to update post' });
  }
}

/**
 * DELETE /api/posts/:id
 * Challenges.md #1: delete scoped to a specific id, parameterized.
 */
export async function deleteBlogEntryHandler(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({ error: 'Invalid id' });
      return;
    }

    await deleteBlogEntry(id);
    res.status(204).send();
  } catch (err) {
    if ((err as Error).message.includes('not found')) {
      res.status(404).json({ error: (err as Error).message });
      return;
    }
    console.error('Failed to delete post:', err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
}
