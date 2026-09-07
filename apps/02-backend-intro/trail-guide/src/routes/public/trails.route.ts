import { Router } from 'express';
import trailController from '../../controllers/public/trail.controller';
import trailsController from '../../controllers/public/trails.controller';

const trails: Router = Router();

trails.get('/trails', trailsController);
trails.get('/trails/:slug', trailController);

export default trails;
