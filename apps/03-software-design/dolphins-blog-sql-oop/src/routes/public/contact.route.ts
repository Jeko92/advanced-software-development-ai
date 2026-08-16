import { Router } from 'express';
import {ContactController} from '../../controllers/public/ContactController.ts';

export function createContactRoute(contactController: ContactController): Router {
  const router: Router = Router();
  router.get('/contact', contactController.index);
  return router;
}
