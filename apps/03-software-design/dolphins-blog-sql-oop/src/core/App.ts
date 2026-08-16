import express, { type Express, type Router } from 'express';
import nunjucks from 'nunjucks';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { ErrorHandlerMiddleware } from '../middlewares/ErrorHandlerMiddleware.ts';
import type { AuthService } from '../services/AuthService.ts';

export class App {
  readonly expressApp: Express;

  constructor(
    private readonly publicRoutes: Router,
    private readonly adminRoutes: Router,
    private readonly apiRoutes: Router,
    private readonly errorHandlerMiddleware: ErrorHandlerMiddleware,
    private readonly authService: AuthService,
  ) {
    this.expressApp = express();

    this.configureViews();
    this.configureMiddlewares();
    this.configureRoutes();
  }

  private configureViews(): void {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const srcDir = path.resolve(__dirname, '..');
    const viewsDir = path.join(srcDir, 'views');

    this.expressApp.set('views', viewsDir);
    this.expressApp.set('view engine', 'njk');

    const env = nunjucks.configure(viewsDir, {
      autoescape: true,
      express: this.expressApp,
      watch: true,
    });

    env.addGlobal('currentYear', () => new Date().getFullYear());
  }

  private configureMiddlewares(): void {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const srcDir = path.resolve(__dirname, '..');

    const assetsDir = path.join(srcDir, 'assets');
    const cssDir = path.join(srcDir, 'css');

    this.expressApp.use('/assets', express.static(assetsDir));
    this.expressApp.use('/css', express.static(cssDir));
    this.expressApp.use(express.static('public'));

    this.expressApp.use(express.urlencoded({ extended: true }));
    this.expressApp.use(express.json());
    this.expressApp.use(cookieParser(this.authService.cookieSecret));
  }

  private configureRoutes(): void {
    this.expressApp
      .use(this.publicRoutes)
      .use(this.adminRoutes)
      .use(this.apiRoutes)
      .use(this.errorHandlerMiddleware.handle);
  }

  listen(port: number): void {
    this.expressApp.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  }
}
