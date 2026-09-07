import { Router } from 'express';
import contactController from '../../controllers/public/contact.controller';

const contact: Router = Router();

contact.get('/contact', contactController);

export default contact;
