import { Router } from 'express';
import homeController from '../../controllers/public/home.controller.ts';

const home: Router = Router();

home.get('/', homeController);

export default home;
