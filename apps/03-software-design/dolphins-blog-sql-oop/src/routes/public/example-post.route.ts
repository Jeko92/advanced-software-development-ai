import { Router } from 'express';
import {ExamplePostController} from '../../controllers/public/ExamplePostController.ts';

export function createExamplePostRoute(examplePostController: ExamplePostController ): Router {
  const router: Router = Router();
  router.get('/', examplePostController.index);
  return router;
}
