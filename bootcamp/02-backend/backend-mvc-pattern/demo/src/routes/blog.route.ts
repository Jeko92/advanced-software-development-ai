import { Router } from 'express';
import { listPosts, showPost } from '../controllers/blog.controller.ts';

const blog: Router = Router();

blog.get('/', listPosts);
blog.get('/:slug', showPost);

export default blog;
