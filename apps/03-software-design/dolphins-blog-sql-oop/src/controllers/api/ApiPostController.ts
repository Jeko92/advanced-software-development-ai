import type { Request, Response } from 'express';
import type { PostService } from '../../services/PostService.ts';
import type { Post } from '../../entities/Post.ts';

const SAFE_FILENAME_PATTERN = /^[A-Za-z0-9._-]+$/;

function isSafeImageFilename(image: unknown): image is string {
  return typeof image === 'string' && SAFE_FILENAME_PATTERN.test(image);
}

export class ApiPostController {
  constructor(private readonly postService: PostService) {}

  /**
   * GET /api/posts/random
   * Returns a single random post in JSON format
   */
  getRandomPost = async (_req: Request, res: Response): Promise<void> => {
    try {
      const post = await this.postService.getRandomPost();

      if (!post) {
        res.status(404).json({ error: 'No posts available' });
        return;
      }

      res.json(post);
    } catch (err) {
      console.error('Failed to retrieve random post:', err);
      res.status(500).json({ error: 'Failed to retrieve random post' });
    }
  };

  /**
   * GET /api/posts/latest
   * Returns the most recently created post
   */
  getLatestPost = async (_req: Request, res: Response): Promise<void> => {
    try {
      const post = await this.postService.getLatestPost();

      if (!post) {
        res.status(404).json({ error: 'No posts available' });
        return;
      }

      res.json(post);
    } catch (err) {
      console.error('Failed to retrieve latest post:', err);
      res.status(500).json({ error: 'Failed to retrieve latest post' });
    }
  };

  /**
   * GET /api/posts/stats
   * Returns statistics about posts (total count, author counts, average length, etc.)
   */
  getPostStats = async (_req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.postService.getStats();
      res.json(stats);
    } catch (err) {
      console.error('Failed to calculate post statistics:', err);
      res.status(500).json({ error: 'Failed to calculate post statistics' });
    }
  };

  /**
   * GET /api/posts/with-authors
   * Challenges.md #2: SELECT with a JOIN, each post alongside its author's name.
   */
  getPostsWithAuthorsHandler = async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const posts = await this.postService.getPostsWithAuthors();
      res.json(posts);
    } catch (err) {
      console.error('Failed to retrieve posts with authors:', err);
      res.status(500).json({ error: 'Failed to retrieve posts with authors' });
    }
  };

  /**
   * POST /api/posts
   * Challenges.md #1: create, parameterized, returns the new post's id.
   */
  createBlogEntryHandler = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { title, author, teaser, content, image } = req.body || {};

      if (!title || !author) {
        res.status(400).json({ error: 'title and author are required' });
        return;
      }

      if (image && !isSafeImageFilename(image)) {
        res.status(400).json({ error: 'image must be a plain filename' });
        return;
      }

      const id = await this.postService.createBlogEntry({
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
  };

  /**
   * PUT /api/posts/:id
   * Challenges.md #1: update scoped to a specific id, parameterized.
   */
  updateBlogEntryHandler = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> => {
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
      if (image !== undefined) {
        if (image && !isSafeImageFilename(image)) {
          res.status(400).json({ error: 'image must be a plain filename' });
          return;
        }
        changes.image = image;
      }

      await this.postService.updateBlogEntry(id, changes);
      res.status(200).json({ id });
    } catch (err) {
      if ((err as Error).message.includes('not found')) {
        res.status(404).json({ error: (err as Error).message });
        return;
      }
      console.error('Failed to update post:', err);
      res.status(500).json({ error: 'Failed to update post' });
    }
  };

  /**
   * DELETE /api/posts/:id
   * Challenges.md #1: delete scoped to a specific id, parameterized.
   */
  deleteBlogEntryHandler = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id)) {
        res.status(400).json({ error: 'Invalid id' });
        return;
      }

      await this.postService.deleteBlogEntry(id);
      res.status(204).send();
    } catch (err) {
      if ((err as Error).message.includes('not found')) {
        res.status(404).json({ error: (err as Error).message });
        return;
      }
      console.error('Failed to delete post:', err);
      res.status(500).json({ error: 'Failed to delete post' });
    }
  };
}
