import { Router } from 'express';
import {ExamplePostController} from '../../controllers/public/ExamplePostController.ts';

export function createExamplePostRoute(examplePostController: ExamplePostController ): Router {
  const router: Router = Router();
  router.get('/example-post', examplePostController.index);
  return router;
}
