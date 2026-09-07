import { Router } from 'express';
import {
  getLatestPost,
  getPostStats,
  getRandomPost,
  getPostsWithAuthorsHandler,
  createBlogEntryHandler,
  updateBlogEntryHandler,
  deleteBlogEntryHandler,
} from '../../controllers/api/api.controllers.ts';
import { requireAdminApi } from '../../middlewares/auth.ts';

const apiRoute: Router = Router();

apiRoute.get('/posts/random', getRandomPost);
apiRoute.get('/posts/latest', getLatestPost);
apiRoute.get('/posts/stats', getPostStats);
apiRoute.get('/posts/with-authors', getPostsWithAuthorsHandler);
apiRoute.post('/posts', requireAdminApi, createBlogEntryHandler);
apiRoute.put('/posts/:id', requireAdminApi, updateBlogEntryHandler);
apiRoute.delete('/posts/:id', requireAdminApi, deleteBlogEntryHandler);

export default apiRoute;
