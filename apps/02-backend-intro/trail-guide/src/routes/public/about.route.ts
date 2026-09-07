import { Router } from 'express';
import aboutController from '../../controllers/public/about.controller.ts';

const about: Router = Router();

about.get('/about', aboutController);

export default about;
