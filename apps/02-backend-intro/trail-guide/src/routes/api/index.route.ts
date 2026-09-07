import { Router } from 'express';
import apiRoute from './api.route.ts';

const apiRoutes: Router = Router();

apiRoutes.use('/api', apiRoute);

export default apiRoutes;
