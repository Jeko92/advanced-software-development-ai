import { Router } from 'express';
import Database from '../../db/Databse.ts';
import { PostRepository } from '../../repositories/PostRepository.ts';
import { PostService } from '../../services/PostService.ts';
import { ApiPostController } from '../../controllers/api/ApiPostController.ts';
import { createApiRoute } from './api.route.ts';

const postRepository = new PostRepository(Database.getInstance());
const postService = new PostService(postRepository);
const apiPostController = new ApiPostController(postService);
const apiRoute = createApiRoute(apiPostController);

const apiRoutes: Router = Router();

apiRoutes.use('/api', apiRoute);

export default apiRoutes;
