import { Router } from 'express';

import type { AdminPostController } from '../../controllers/admin/AdminPostController';
import type { AdminAuthorController } from '../../controllers/admin/AdminAuthorController';
import type { AuthController } from '../../controllers/admin/AuthController';
import type { AuthMiddleware } from '../../middlewares/AuthMiddleware';
import type { UploadMiddleware } from '../../middlewares/UploadMiddleware';

import { createAdminRoute } from './admin.route';

export function createAdminRoutes(
  adminPostController: AdminPostController,
  adminAuthorController: AdminAuthorController,
  authController: AuthController,
  authMiddleware: AuthMiddleware,
  uploadMiddleware: UploadMiddleware,
): Router {
  const adminRoute = createAdminRoute(
    adminPostController,
    adminAuthorController,
    uploadMiddleware,
  );

  const adminRoutes = Router();

  // Public admin auth routes
  adminRoutes.get('/login', authController.getLogin);
  adminRoutes.post('/login', authController.postLogin);
  adminRoutes.get('/logout', authController.getLogout);

  // Protected admin routes
  adminRoutes.use('/admin', authMiddleware.requireAdminAny, adminRoute);

  return adminRoutes;
}
