import { Router } from 'express';
import type { HomeController } from '../../controllers/public/HomeController.ts';

export function createHomeRoute(homeController: HomeController): Router {
  const router: Router = Router();
  router.get('/', homeController.index);
  return router;
}