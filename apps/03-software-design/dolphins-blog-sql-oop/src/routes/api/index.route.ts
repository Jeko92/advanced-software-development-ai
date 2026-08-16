import { Router } from 'express';
import Database from '../../db/Databse.ts';
import { PostRepository } from '../../repositories/PostRepository.ts';
import { PostService } from '../../services/PostService.ts';
import { ApiPostController } from '../../controllers/api/ApiPostController.ts';
import { AuthService } from '../../services/AuthService.ts';
import { AuthMiddleware } from '../../middlewares/AuthMiddleware.ts';
import { createApiRoute } from './api.route.ts';

const postRepository = new PostRepository(Database.getInstance());
const postService = new PostService(postRepository);
const apiPostController = new ApiPostController(postService);

const authService = new AuthService();
const authMiddleware = new AuthMiddleware(authService);

const apiRoute = createApiRoute(apiPostController, authMiddleware);

const apiRoutes: Router = Router();

apiRoutes.use('/api', apiRoute);

export default apiRoutes;
