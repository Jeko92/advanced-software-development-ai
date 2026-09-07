import { Router } from 'express';
import postController from '../../controllers/public/post.controller.ts';

const postRoute: Router = Router();

postRoute.get('/posts/:slug', postController);

export default postRoute;
