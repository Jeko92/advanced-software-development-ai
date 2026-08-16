import { Router } from 'express';
import type { AdminPostController } from '../../controllers/admin/AdminPostController.ts';
import {
  getAdminAuthors,
  createAuthorHandler,
  deleteAuthorHandler,
} from '../../controllers/admin/authors.controller.ts';
import { upload } from '../../middlewares/upload.ts';

export function createAdminRoute(
  adminPostController: AdminPostController,
): Router {
  const adminRoute: Router = Router();

  adminRoute.get('/', adminPostController.getAdminDashboard);
  adminRoute.get('/posts/new', adminPostController.getNewPostForm);
  adminRoute.post(
    '/posts',
    upload.single('image'),
    adminPostController.createPost,
  );
  adminRoute.get('/posts/:slug/edit', adminPostController.getEditPostForm);
  adminRoute.post(
    '/posts/:slug',
    upload.single('image'),
    adminPostController.updatePostHandler,
  );
  adminRoute.post('/posts/:slug/delete', adminPostController.deletePostHandler);

  // Author routes: still the pre-refactor free functions — Phase 3 in
  // README.md, not this one.
  adminRoute.get('/authors', getAdminAuthors);
  adminRoute.post('/authors', createAuthorHandler);
  adminRoute.post('/authors/:id/delete', deleteAuthorHandler);

  return adminRoute;
}
