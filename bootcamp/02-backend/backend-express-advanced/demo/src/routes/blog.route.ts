import { Router, type Request, type Response } from 'express';
import { marked } from 'marked';
import { readdir, readFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { authenticate } from '../auth/auth-mock.ts';

const BLOG_DIR = path.join(process.cwd(), 'blog');
const SLUG_PATTERN = /^[a-z0-9-]+$/i;

/**
 * Resolves a slug to an absolute .md path inside BLOG_DIR, or null if the
 * slug is not safe to use (rejects path separators, "..", and anything that
 * would resolve outside of BLOG_DIR).
 */
function resolvePostPath(slug: string): string | null {
  if (!SLUG_PATTERN.test(slug)) {
    return null;
  }

  const resolved = path.resolve(BLOG_DIR, `${slug}.md`);

  if (!resolved.startsWith(BLOG_DIR + path.sep)) {
    return null;
  }

  return resolved;
}

const blog: Router = Router();

blog.get('/', async (_req: Request, res: Response) => {
  const files = await readdir(BLOG_DIR);

  const blogEntries = files.map((file) => {
    const slug = file.replace('.md', '');
    const words = slug.split('-');
    const title = words
      .map((word) => word[0]?.toUpperCase() + word.slice(1))
      .join(' ');

    return { slug, title };
  });

  res.render('blog.njk', { title: 'Blog', posts: blogEntries });
});

blog.get('/:slug', async (req: Request<{ slug: string }>, res: Response) => {
  const { slug } = req.params;
  const filepath = resolvePostPath(slug);

  if (!filepath) {
    res.status(400).send('Invalid slug');
    return;
  }

  try {
    const fileContent = await readFile(filepath);
    const html = marked.parse(fileContent.toString());

    res.render('post.njk', { title: `Blog - ${slug}`, html });
  } catch {
    res.status(404).send('Post not found');
  }
});

blog.use(authenticate);

blog.delete('/:slug', async (req: Request<{ slug: string }>, res: Response) => {
  const { slug } = req.params;
  const filepath = resolvePostPath(slug);

  if (!filepath) {
    res.status(400).send('Invalid slug');
    return;
  }

  try {
    await unlink(filepath);
    res.status(204).send();
  } catch {
    res.status(404).send('Post not found');
  }
});

export default blog;
