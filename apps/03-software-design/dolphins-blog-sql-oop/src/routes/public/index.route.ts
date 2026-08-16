import { Router } from 'express';
import Database from '../../db/Databse.ts';
import { PostRepository } from '../../repositories/PostRepository.ts';
import { PostService } from '../../services/PostService.ts';
import { HomeController } from '../../controllers/public/HomeController.ts';
import { PostController } from '../../controllers/public/PostController.ts';
import { createHomeRoute } from './home.route.ts';
import { createPostRoute } from './post.route.ts';
import { createAboutRoute } from './about.route.ts';
import { createContactRoute } from './contact.route.ts';
import { createExamplePostRoute } from './example-post.route.ts';
import { AboutController } from '../../controllers/public/AboutController.ts';
import {
  ContactController
} from '../../controllers/public/ContactController.ts';
import {
  ExamplePostController
} from '../../controllers/public/ExamplePostController.ts';

const postRepository = new PostRepository(Database.getInstance());
const postService = new PostService(postRepository);
const homeController = new HomeController(postService);
const postController = new PostController(postService);
const aboutController = new AboutController();
const contactController = new ContactController();
const examplePostController = new ExamplePostController();

const publicRoutes: Router = Router();

publicRoutes
  .use(createHomeRoute(homeController))
  .use(createPostRoute(postController))
  .use(createContactRoute(contactController))
  .use(createAboutRoute(aboutController))
  .use(createExamplePostRoute(examplePostController));

export default publicRoutes;
