import Database from './db/Databse.ts';
import { App } from './core/App.ts';

import { PostRepository } from './repositories/PostRepository.ts';
import { AuthorRepository } from './repositories/AuthorRepository.ts';

import { PostService } from './services/PostService.ts';
import { AuthorService } from './services/AuthorService.ts';
import { AuthService } from './services/AuthService.ts';
import { ImageStorageService } from './services/ImageStorageService.ts';

import { ErrorHandlerMiddleware } from './middlewares/ErrorHandlerMiddleware.ts';
import { AuthMiddleware } from './middlewares/AuthMiddleware.ts';
import { UploadMiddleware } from './middlewares/UploadMiddleware.ts';

import { HomeController } from './controllers/public/HomeController.ts';
import { PostController } from './controllers/public/PostController.ts';
import { AboutController } from './controllers/public/AboutController.ts';
import { ContactController } from './controllers/public/ContactController.ts';
import { ExamplePostController } from './controllers/public/ExamplePostController.ts';

import { AdminPostController } from './controllers/admin/AdminPostController.ts';
import { AdminAuthorController } from './controllers/admin/AdminAuthorController.ts';
import { AuthController } from './controllers/admin/AuthController.ts';

import { ApiPostController } from './controllers/api/ApiPostController.ts';

import { createPublicRoutes } from './routes/public/index.route.ts';
import { createAdminRoutes } from './routes/admin/index.route.ts';
import { createApiRoute } from './routes/api/api.route.ts';

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

  const adminAuthorController = new AdminAuthorController(
    authorService,
  );

  const authController = new AuthController(
    authService,
  );

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
  const apiRoutes = createApiRoute(
    apiPostController,
    authMiddleware,
  );

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
