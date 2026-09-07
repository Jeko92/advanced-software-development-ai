import { Router } from 'express';
import * as APIController from '../controller/APIController.ts';

const APIRouter: Router = Router();

APIRouter.get('/blogs', APIController.getAllBlogs);
APIRouter.get('/blogs/:id', APIController.getBlogById);

export default APIRouter;
