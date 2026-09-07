import { Router } from 'express';
import contactController from '../../controllers/public/contact.controller.ts';

const contactRoute: Router = Router();

contactRoute.get('/contact', contactController);

export default contactRoute;
