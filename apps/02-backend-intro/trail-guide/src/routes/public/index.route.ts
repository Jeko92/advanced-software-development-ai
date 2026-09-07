import { Router } from 'express';
import home from './home.route.ts';
import about from './about.route.ts';
import contact from './contact.route.ts';
import regions from './regions.route.ts';
import trails from './trails.route.ts';

const publicRoutes: Router = Router();

publicRoutes.use(home).use(about).use(regions).use(trails).use(contact);

export default publicRoutes;
