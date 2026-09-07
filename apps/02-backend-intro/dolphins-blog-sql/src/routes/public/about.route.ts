import { Router } from 'express';
import aboutController from '../../controllers/public/about.controller';

const aboutRoute: Router = Router();

aboutRoute.get('/about', aboutController);

export default aboutRoute;
