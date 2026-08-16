import { Router } from 'express';
import Database from '../../db/Databse.ts';
import { PostRepository } from '../../repositories/PostRepository.ts';
import { PostService } from '../../services/PostService.ts';
import { AdminPostController } from '../../controllers/admin/AdminPostController.ts';
import { AuthorRepository } from '../../repositories/AuthorRepository.ts';
import { AuthorService } from '../../services/AuthorService.ts';
import { AdminAuthorController } from '../../controllers/admin/AdminAuthorController.ts';
import { AuthService } from '../../services/AuthService.ts';
import { AuthMiddleware } from '../../middlewares/AuthMiddleware.ts';
import { AuthController } from '../../controllers/admin/AuthController.ts';
import { createAdminRoute } from './admin.route.ts';

const postRepository = new PostRepository(Database.getInstance());
const postService = new PostService(postRepository);
const adminPostController = new AdminPostController(postService);

const authorRepository = new AuthorRepository(Database.getInstance());
const authorService = new AuthorService(authorRepository);
const adminAuthorController = new AdminAuthorController(authorService);

const authService = new AuthService();
const authMiddleware = new AuthMiddleware(authService);
const authController = new AuthController(authService);

const adminRoute = createAdminRoute(adminPostController, adminAuthorController);

const adminRoutes: Router = Router();

adminRoutes.get('/login', authController.getLogin);
adminRoutes.post('/login', authController.postLogin);
adminRoutes.get('/logout', authController.getLogout);

adminRoutes.use('/admin', authMiddleware.requireAdminAny, adminRoute);

export default adminRoutes;
