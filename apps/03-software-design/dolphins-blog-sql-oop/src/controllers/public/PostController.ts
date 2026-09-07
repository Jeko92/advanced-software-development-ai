import type { Request, Response } from 'express';
import { formatDate } from '../../utils/utils.ts';
import type { PostService } from '../../services/PostService.ts';

export class PostController {
  constructor(private readonly postService: PostService) {}

  index = async (req: Request, res: Response): Promise<void> => {
    const slug = Array.isArray(req.params['slug'])
      ? req.params['slug'][0]
      : req.params['slug'];

    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      res.status(400).send('Invalid slug');
      return;
    }

    try {
      const result = await this.postService.getPostWithNeighbors(slug);

      if (!result) {
        res.status(404).render('public/404.njk', { title: 'Post Not Found' });
        return;
      }

      const { post, previousPost, nextPost } = result;

      const formattedPost = {
        ...post,
        createdAtFormatted: formatDate(post.createdAt),
      };

      res.render('public/post.njk', {
        title: post.title,
        post: formattedPost,
        previousPost,
        nextPost,
      });
    } catch (err) {
      console.error('Error loading blog entries:', err);
      res.status(500).render('public/500.njk', { title: 'Server Error' });
    }
  };
}