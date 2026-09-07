import express from 'express';
import nunjucks from 'nunjucks';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'node:url';
import publicRoutes from './routes/public/index.route.ts';
import adminRoutes from './routes/admin/index.route.ts';
import apiRoutes from './routes/api/index.route.ts';
import { COOKIE_SECRET } from './middlewares/auth.ts';
import { errorHandler } from './middlewares/error-handler.ts';

// import { addPost, deletePost, loadPosts, updatePost } from './models/post.model';
// import { getCurrentUnixTimestamp } from './utils/utils';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const viewsDir = path.join(projectRoot, 'src', 'views');
const assetsDir = path.join(projectRoot, 'src', 'assets');
const cssDir = path.join(projectRoot, 'src', 'css');

app.set('views', viewsDir);
app.set('view engine', 'njk');

const env = nunjucks.configure(viewsDir, {
  autoescape: true,
  express: app,
  watch: true,
});

env.addGlobal('currentYear', () => new Date().getFullYear());

app.use('/assets', express.static(assetsDir));
app.use('/css', express.static(cssDir));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(COOKIE_SECRET));

app.use(publicRoutes).use(adminRoutes).use(apiRoutes);

// Must be registered after every router — see error-handler.ts.
app.use(errorHandler);

// async function runCrudTest () {
//   console.log('--- before addPost ---');
//   console.log(await loadPosts());
//
//   await addPost({
//     title: 'Test Post',
//     image: 'skjskjds',
//     author: 'john doe',
//     createdAt: getCurrentUnixTimestamp(),
//     teaser: 'teaser',
//     content: 'paragraph'
//   });
//
//   console.log('--- after addPost ---');
//   console.log(await loadPosts());
//
//   await updatePost('test-post', { teaser: 'teaser updated' });
//
//   console.log('--- after updatePost ---');
//   console.log(await loadPosts());
//
//   await deletePost('test-post');
//
//   console.log('--- after deletePost ---');
//   console.log(await loadPosts());
// }
//
// runCrudTest();

const port = Number(process.env['PORT']) || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
