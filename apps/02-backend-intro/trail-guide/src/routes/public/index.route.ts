import { Router } from 'express';
import home from './home.route';
import about from './about.route';
import contact from './contact.route';
import regions from './regions.route';
import trails from './trails.route';

const publicRoutes: Router = Router();

publicRoutes.use(home).use(about).use(regions).use(trails).use(contact);

export default publicRoutes;
