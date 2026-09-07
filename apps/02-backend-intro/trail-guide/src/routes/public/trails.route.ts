import { Router } from 'express';
import trailController from '../../controllers/public/trail.controller.ts';
import trailsController from '../../controllers/public/trails.controller.ts';

const trails: Router = Router();

trails.get('/trails', trailsController);
trails.get('/trails/:slug', trailController);

export default trails;
