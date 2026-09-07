import { Router } from 'express';
import * as APIController from '../controller/APIController';

const APIRouter: Router = Router();

APIRouter.get('/blogs', APIController.getAllBlogs);
APIRouter.get('/blogs/:id', APIController.getBlogById);

export default APIRouter;
