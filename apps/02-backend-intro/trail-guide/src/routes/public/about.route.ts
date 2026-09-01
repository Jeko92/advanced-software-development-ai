import { Router } from 'express';
import aboutController from '../../controllers/public/about.controller';

const about: Router = Router();

about.get('/about', aboutController);

export default about;
