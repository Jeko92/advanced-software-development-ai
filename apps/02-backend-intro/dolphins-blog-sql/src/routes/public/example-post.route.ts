import { Router } from 'express';
import examplePostController from '../../controllers/public/example-post.controller.ts';

const samplePostRoute: Router = Router();

samplePostRoute.get('/example-post', examplePostController);

export default samplePostRoute;
