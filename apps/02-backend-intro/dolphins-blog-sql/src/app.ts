import express from 'express';
import nunjucks from 'nunjucks';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import publicRoutes from './routes/public/index.route';
import adminRoutes from './routes/admin/index.route';
import apiRoutes from './routes/api/index.route';
import { connectDB } from './db/database';
import { COOKIE_SECRET } from './middlewares/auth';
import { errorHandler } from './middlewares/error-handler';

const app = express();

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
app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));

app.use(publicRoutes).use(adminRoutes).use(apiRoutes);

// Must be registered after every router — see error-handler.ts.
app.use(errorHandler);

const port = Number(process.env['PORT']) || 3000;

async function init() {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

init();
