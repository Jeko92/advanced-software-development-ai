import { Router } from 'express';
import {
  getTrailsController,
  getTrailBySlugController,
  createTrailApiController,
  patchTrailApiController,
  deleteTrailApiController,
} from '../../controllers/api/api.trail.controller';
import {
  getRegionsController,
  getTrailsByRegionIdController,
} from '../../controllers/api/api.region.controller';
import { apiKeyHandler } from '../../middleware/api-key';
import { rateLimitHandler } from '../../middleware/rate-limit';

const apiRoute: Router = Router();

apiRoute.get('/trails', getTrailsController);
apiRoute.post(
  '/trails',
  apiKeyHandler,
  rateLimitHandler,
  createTrailApiController,
);
apiRoute.get('/trails/:slug', getTrailBySlugController);
apiRoute.patch(
  '/trails/:id',
  apiKeyHandler,
  rateLimitHandler,
  patchTrailApiController,
);
apiRoute.delete(
  '/trails/:id',
  apiKeyHandler,
  rateLimitHandler,
  deleteTrailApiController,
);
apiRoute.get('/regions', getRegionsController);
apiRoute.get('/regions/:slug/trails', getTrailsByRegionIdController);

export default apiRoute;
