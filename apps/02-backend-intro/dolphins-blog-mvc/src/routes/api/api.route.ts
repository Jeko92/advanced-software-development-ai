import { Router } from 'express';
import {
  getLatestPost,
  getPostStats,
  getRandomPost,
} from '../../controllers/api/api.controllers.ts';

const apiRoute: Router = Router();

apiRoute.get('/posts/random', getRandomPost);
apiRoute.get('/posts/latest', getLatestPost);
apiRoute.get('/posts/stats', getPostStats);

export default apiRoute;
