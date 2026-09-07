import { Router } from 'express';
import regionsController from '../../controllers/public/regions.controller.ts';
import regionController from '../../controllers/public/region.controller.ts';

const regions: Router = Router();

regions.get('/regions', regionsController);
regions.get('/regions/:slug', regionController);

export default regions;
