import { Router } from 'express';
import type { PostController } from '../../controllers/public/PostController.ts';

export function createPostRoute(postController: PostController): Router {
  const router: Router = Router();
  router.get('/posts/:slug', postController.index);
  return router;
}