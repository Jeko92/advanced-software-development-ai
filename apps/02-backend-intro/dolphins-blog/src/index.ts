import express, { type Request, type Response } from 'express';
import nunjucks from 'nunjucks';
import { getBlogEntries, getPostWithNeighbors } from './utils/blog.js';

const app = express();
const port = 3000;

const env = nunjucks.configure('src/views', {
  autoescape: true,
  express: app,
  watch: true,
});

env.addGlobal('currentYear', () => new Date().getFullYear());

app.set('view engine', 'njk');
app.use(express.static('public'));

const HOME_PREVIEW_LIMIT = 2;

app.get('/', async (req: Request, res: Response) => {
  try {
    const entries = await getBlogEntries();
    const showAll = req.query['all'] === 'true';
    const BlogEntries = showAll
      ? entries
      : entries.slice(0, HOME_PREVIEW_LIMIT);
    const hasOlderPosts = !showAll && entries.length > HOME_PREVIEW_LIMIT;

    res.render('home.njk', { title: 'Blog Home', BlogEntries, hasOlderPosts });
  } catch (err) {
    console.error('Error loading dolphins-blog entries:', err);
    res.status(500).render('500.njk', { title: 'Server Error' });
  }
});

app.get('/about', (_req: Request, res: Response) => {
  res.render('about.njk', { title: 'Blog About' });
});

app.get('/post/:slug', async (req: Request, res: Response) => {
  try {
    const slug = req.params['slug'];

    if (typeof slug !== 'string') {
      res.status(400).send('Missing slug');
      return;
    }

    const result = await getPostWithNeighbors(slug);

    if (!result) {
      return res.status(404).render('404.njk', { title: 'Post Not Found' });
    }

    const { post, newerPost, olderPost } = result;
    res.render('post.njk', { title: post.title, post, newerPost, olderPost });
  } catch (err) {
    console.error('Error loading dolphins-blog entries:', err);
    res.status(500).render('500.njk', { title: 'Server Error' });
  }
});

app.get('/contact', (_req: Request, res: Response) => {
  res.render('contact.njk', { title: 'Contact Me' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
