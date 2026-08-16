import { Router } from 'express';

import type { HomeController } from '../../controllers/public/HomeController.ts';
import type { PostController } from '../../controllers/public/PostController.ts';
import type { AboutController } from '../../controllers/public/AboutController.ts';
import type { ContactController } from '../../controllers/public/ContactController.ts';
import type { ExamplePostController } from '../../controllers/public/ExamplePostController.ts';

import { createHomeRoute } from './home.route.ts';
import { createPostRoute } from './post.route.ts';
import { createAboutRoute } from './about.route.ts';
import { createContactRoute } from './contact.route.ts';
import { createExamplePostRoute } from './example-post.route.ts';

export function createPublicRoutes(
  homeController: HomeController,
  postController: PostController,
  aboutController: AboutController,
  contactController: ContactController,
  examplePostController: ExamplePostController,
): Router {
  const publicRoutes = Router();

  publicRoutes.use('/', createHomeRoute(homeController));
  publicRoutes.use('/posts', createPostRoute(postController));
  publicRoutes.use('/about', createAboutRoute(aboutController));
  publicRoutes.use('/contact', createContactRoute(contactController));
  publicRoutes.use('/example-post', createExamplePostRoute(examplePostController));

  return publicRoutes;
}
