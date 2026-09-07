import { Router } from 'express';
import contactController from '../../controllers/public/contact.controller';

const contactRoute: Router = Router();

contactRoute.get('/contact', contactController);

export default contactRoute;
