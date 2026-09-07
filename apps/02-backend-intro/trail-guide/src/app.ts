import express, { type Request, type Response } from 'express';
import nunjucks from 'nunjucks';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import publicRoutes from './routes/public/index.route';
import { closeDB, connectDB } from './db/database';
import cors from 'cors';
import { logger } from './middleware/logger-middleware';
import { errorHandler } from './middleware/error-middleware';
import { COOKIE_SECRET } from './middleware/auth';
import adminRoutes from './routes/admin/index.route';
import apiRoutes from './routes/api/index.route';

const app = express();

const projectRoot = path.resolve(__dirname, '..');

const viewsDir = path.join(projectRoot, 'src', 'views');
const assetsDir = path.join(projectRoot, 'public', 'assets');
const cssDir = path.join(projectRoot, 'src', 'css');
const picoDir = path.join(
  projectRoot,
  'node_modules',
  '@picocss',
  'pico',
  'css',
);
const quillDir = path.join(projectRoot, 'node_modules', 'quill', 'dist');

// --- App Configuration ---
app.set('views', viewsDir);
app.set('view engine', 'njk');

const env = nunjucks.configure(viewsDir, {
  autoescape: true,
  express: app,
  watch: true,
});

env.addGlobal('currentYear', () => new Date().getFullYear());

// --- Middleware & Routes ---
app.use('/assets', express.static(assetsDir));
app.use('/css', express.static(picoDir));
app.use('/css', express.static(cssDir));
app.use('/vendor/quill', express.static(quillDir));
app.use(express.static(path.join(projectRoot, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));
app.use(cors());
app.use(logger);

app.use(publicRoutes).use(adminRoutes).use(apiRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404);
  try {
    res.render('public/404.njk', { title: 'Not found' });
  } catch (err) {
    console.error('Error rendering 404 page:', err);
    res
      .status(500)
      .render('public/500.njk', { title: 'Internal Server Error' });
  }
});

app.use(errorHandler);

const port = Number(process.env['PORT']) || 3000;

// --- Application Lifecycle ---
async function main() {
  await connectDB();

  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);

    const forceExit = setTimeout(() => {
      console.error('Graceful shutdown timed out — forcing exit.');
      process.exit(1);
    }, 5000).unref();

    // Stop receiving new HTTP requests
    server.close(async () => {
      try {
        await closeDB();
        console.log('Database connection closed.');
        clearTimeout(forceExit);
        process.exit(0);
      } catch (err) {
        console.error('Error during shutdown:', err);
        clearTimeout(forceExit);
        process.exit(1);
      }
    });
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

main().catch((err: unknown) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
