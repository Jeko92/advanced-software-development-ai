import { Router } from 'express';
import home from './home.route.ts';
import postRoute from './post.route.ts';
import ContactRoute from './contact.route.ts';
import aboutRoute from './about.route.ts';
import samplePostRoute from './example-post.route.ts';

const publicRoutes: Router = Router();

publicRoutes
  .use(home)
  .use(postRoute)
  .use(ContactRoute)
  .use(aboutRoute)
  .use(samplePostRoute);

export default publicRoutes;
