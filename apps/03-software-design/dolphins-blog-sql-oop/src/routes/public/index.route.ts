import { Router } from 'express';
import Database from '../../db/Databse.ts';
import { PostRepository } from '../../repositories/PostRepository.ts';
import { PostService } from '../../services/PostService.ts';
import { HomeController } from '../../controllers/public/HomeController.ts';
import { PostController } from '../../controllers/public/PostController.ts';
import { createHomeRoute } from './home.route.ts';
import { createPostRoute } from './post.route.ts';
import ContactRoute from './contact.route.ts';
import aboutRoute from './about.route.ts';
import samplePostRoute from './example-post.route.ts';

// Temporary manual wiring until Phase 8's composition root exists — see
// README.md. Gets replaced wholesale when app.ts builds this graph once and
// hands the finished routers in.
const postRepository = new PostRepository(Database.getInstance());
const postService = new PostService(postRepository);
const homeController = new HomeController(postService);
const postController = new PostController(postService);

const publicRoutes: Router = Router();

publicRoutes
  .use(createHomeRoute(homeController))
  .use(createPostRoute(postController))
  .use(ContactRoute)
  .use(aboutRoute)
  .use(samplePostRoute);

export default publicRoutes;