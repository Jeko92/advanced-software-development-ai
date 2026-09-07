import { Router } from 'express';
import {AboutController} from '../../controllers/public/AboutController.ts';

export function createAboutRoute(aboutController: AboutController): Router {
  const router: Router = Router();
  router.get('/', aboutController.index);
  return router;
}
