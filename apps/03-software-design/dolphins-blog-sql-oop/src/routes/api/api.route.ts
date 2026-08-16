import { Router } from 'express';
import type { ApiPostController } from '../../controllers/api/ApiPostController.ts';
import type { AuthMiddleware } from '../../middlewares/AuthMiddleware.ts';

export function createApiRoute(
  apiPostController: ApiPostController,
  authMiddleware: AuthMiddleware,
): Router {
  const apiRoute: Router = Router();

  apiRoute.get('/posts/random', apiPostController.getRandomPost);
  apiRoute.get('/posts/latest', apiPostController.getLatestPost);
  apiRoute.get('/posts/stats', apiPostController.getPostStats);
  apiRoute.get(
    '/posts/with-authors',
    apiPostController.getPostsWithAuthorsHandler,
  );
  apiRoute.post(
    '/posts',
    authMiddleware.requireAdminApi,
    apiPostController.createBlogEntryHandler,
  );
  apiRoute.put(
    '/posts/:id',
    authMiddleware.requireAdminApi,
    apiPostController.updateBlogEntryHandler,
  );
  apiRoute.delete(
    '/posts/:id',
    authMiddleware.requireAdminApi,
    apiPostController.deleteBlogEntryHandler,
  );

  return apiRoute;
}
