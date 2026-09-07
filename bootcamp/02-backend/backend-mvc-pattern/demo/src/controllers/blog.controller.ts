import type { Request, Response } from 'express';
import { marked } from 'marked';
import { getAllPosts, getPostBySlug } from '../models/blog.model.ts';

export async function listPosts(_req: Request, res: Response) {
  const posts = await getAllPosts();
  res.render('blog.njk', { title: 'Blog', posts });
}

export async function showPost(req: Request<{ slug: string }>, res: Response) {
  const { slug } = req.params;
  const markdown = await getPostBySlug(slug);

  if (!markdown) {
    res.status(404).send('Post not found');
    return;
  }

  const html = marked.parse(markdown);
  res.render('post.njk', { title: `Blog - ${slug}`, html });
}
