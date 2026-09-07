import { Router } from 'express';
import home from './home.route';
import postRoute from './post.route';
import ContactRoute from './contact.route';
import aboutRoute from './about.route';
import samplePostRoute from './example-post.route';

const publicRoutes: Router = Router();

publicRoutes
  .use(home)
  .use(postRoute)
  .use(ContactRoute)
  .use(aboutRoute)
  .use(samplePostRoute);

export default publicRoutes;
