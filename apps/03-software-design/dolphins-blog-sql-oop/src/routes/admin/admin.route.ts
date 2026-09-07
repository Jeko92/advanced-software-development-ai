import { Router } from 'express';
import type { AdminPostController } from '../../controllers/admin/AdminPostController.ts';
import type { AdminAuthorController } from '../../controllers/admin/AdminAuthorController.ts';
import type { UploadMiddleware } from '../../middlewares/UploadMiddleware.ts';

export function createAdminRoute(
  adminPostController: AdminPostController,
  adminAuthorController: AdminAuthorController,
  uploadMiddleware: UploadMiddleware,
): Router {
  const adminRoute: Router = Router();

  adminRoute.get('/', adminPostController.getAdminDashboard);
  adminRoute.get('/posts/new', adminPostController.getNewPostForm);
  adminRoute.post(
    '/posts',
    uploadMiddleware.single('image'),
    adminPostController.createPost,
  );
  adminRoute.get('/posts/:slug/edit', adminPostController.getEditPostForm);
  adminRoute.post(
    '/posts/:slug',
    uploadMiddleware.single('image'),
    adminPostController.updatePostHandler,
  );
  adminRoute.post('/posts/:slug/delete', adminPostController.deletePostHandler);

  adminRoute.get('/authors', adminAuthorController.getAdminAuthors);
  adminRoute.post('/authors', adminAuthorController.createAuthorHandler);
  adminRoute.post(
    '/authors/:id/delete',
    adminAuthorController.deleteAuthorHandler,
  );

  return adminRoute;
}
