import { Router } from 'express';
import type { ApiPostController } from '../../controllers/api/ApiPostController.ts';
import { requireAdminApi } from '../../middlewares/auth.ts';

export function createApiRoute(apiPostController: ApiPostController): Router {
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
    requireAdminApi,
    apiPostController.createBlogEntryHandler,
  );
  apiRoute.put(
    '/posts/:id',
    requireAdminApi,
    apiPostController.updateBlogEntryHandler,
  );
  apiRoute.delete(
    '/posts/:id',
    requireAdminApi,
    apiPostController.deleteBlogEntryHandler,
  );

  return apiRoute;
}
