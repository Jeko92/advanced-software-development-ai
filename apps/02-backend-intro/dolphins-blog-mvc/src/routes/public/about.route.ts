import { Router } from 'express';
import aboutController from '../../controllers/public/about.controller.ts';

const aboutRoute: Router = Router();

aboutRoute.get('/about', aboutController);

export default aboutRoute;
