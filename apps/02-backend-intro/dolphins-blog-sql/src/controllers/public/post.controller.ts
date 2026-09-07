import type { Request, Response } from 'express';
import { formatDate } from '../../utils/utils.ts';
import { getPostWithNeighbors } from '../../models/post.model.ts';

const postController = async ( req: Request, res: Response ) => {
  const slug = Array.isArray(req.params['slug'])
    ? req.params['slug'][0]
    : req.params['slug'];

  if ( !slug || !/^[a-z0-9-]+$/.test(slug) ) {
    return res.status(400).send('Invalid slug');
  }

  try {
    const result = await getPostWithNeighbors(slug);

    if ( !result ) {
      return res.status(404).render('public/404.njk', { title: 'Post Not Found' });
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
  } catch ( err ) {
    console.error('Error loading blog entries:', err);
    res.status(500).render('public/500.njk', { title: 'Server Error' });
  }
};

export default postController;
