import { Router } from 'express';
import * as APIController from '../controller/APIController';

const APIRouter: Router = Router();

APIRouter.get('/posts', APIController.getAllPosts);
APIRouter.get('/posts/:id', APIController.getPostById);

export default APIRouter;
