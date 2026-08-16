import express from 'express';
import nunjucks from 'nunjucks';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'node:url';
import Database from './db/Databse.ts';
import publicRoutes from './routes/public/index.route.ts';
import adminRoutes from './routes/admin/index.route.ts';
import apiRoutes from './routes/api/index.route.ts';
import { AuthService } from './services/AuthService.ts';
import { ErrorHandlerMiddleware } from './middlewares/ErrorHandlerMiddleware.ts';

const app = express();
const authService = new AuthService();
const errorHandlerMiddleware = new ErrorHandlerMiddleware();

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
app.use(express.json());
app.use(cookieParser(authService.cookieSecret));

app.use(publicRoutes).use(adminRoutes).use(apiRoutes);

// Must be registered after every router — see error-handler.ts.
app.use(errorHandlerMiddleware.handle);

const port = Number(process.env['PORT']) || 3000;

async function init() {
  await Database.getInstance().connect();
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

init();
