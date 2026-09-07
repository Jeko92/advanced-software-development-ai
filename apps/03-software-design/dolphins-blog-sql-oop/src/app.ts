import Database from './db/Databse';
import { App } from './core/App';

import { PostRepository } from './repositories/PostRepository';
import { AuthorRepository } from './repositories/AuthorRepository';

import { PostService } from './services/PostService';
import { AuthorService } from './services/AuthorService';
import { AuthService } from './services/AuthService';
import { ImageStorageService } from './services/ImageStorageService';

import { ErrorHandlerMiddleware } from './middlewares/ErrorHandlerMiddleware';
import { AuthMiddleware } from './middlewares/AuthMiddleware';
import { UploadMiddleware } from './middlewares/UploadMiddleware';

import { HomeController } from './controllers/public/HomeController';
import { PostController } from './controllers/public/PostController';
import { AboutController } from './controllers/public/AboutController';
import { ContactController } from './controllers/public/ContactController';
import { ExamplePostController } from './controllers/public/ExamplePostController';

import { AdminPostController } from './controllers/admin/AdminPostController';
import { AdminAuthorController } from './controllers/admin/AdminAuthorController';
import { AuthController } from './controllers/admin/AuthController';

import { ApiPostController } from './controllers/api/ApiPostController';

import { createPublicRoutes } from './routes/public/index.route';
import { createAdminRoutes } from './routes/admin/index.route';
import { createApiRoute } from './routes/api/api.route';

async function main(): Promise<void> {
  // Infrastructure
  const database = Database.getInstance();
  await database.connect();

  // Repositories
  const postRepository = new PostRepository(database);
  const authorRepository = new AuthorRepository(database);

  // Services
  const postService = new PostService(postRepository);
  const authorService = new AuthorService(authorRepository);
  const authService = new AuthService();
  const imageStorageService = new ImageStorageService();

  // Middleware dependencies
  const authMiddleware = new AuthMiddleware(authService);
  const uploadMiddleware = new UploadMiddleware();

  // Public controllers
  const homeController = new HomeController(postService);
  const postController = new PostController(postService);
  const aboutController = new AboutController();
  const contactController = new ContactController();
  const examplePostController = new ExamplePostController();

  // Public routes
  const publicRoutes = createPublicRoutes(
    homeController,
    postController,
    aboutController,
    contactController,
    examplePostController,
  );

  // Admin controllers
  const adminPostController = new AdminPostController(
    postService,
    imageStorageService,
  );

  const adminAuthorController = new AdminAuthorController(authorService);

  const authController = new AuthController(authService);

  // Admin routes
  const adminRoutes = createAdminRoutes(
    adminPostController,
    adminAuthorController,
    authController,
    authMiddleware,
    uploadMiddleware,
  );

  // API controllers
  const apiPostController = new ApiPostController(postService);

  // API routes
  const apiRoutes = createApiRoute(apiPostController, authMiddleware);

  // Error handling
  const errorHandlerMiddleware = new ErrorHandlerMiddleware();

  // Application
  const app = new App(
    publicRoutes,
    adminRoutes,
    apiRoutes,
    errorHandlerMiddleware,
    authService,
  );

  const port = Number(process.env['PORT']) || 3000;

  app.listen(port);
}

main();
