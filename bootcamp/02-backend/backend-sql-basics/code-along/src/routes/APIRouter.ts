import express, { type Router } from 'express';
import * as APIController from '../controller/APIController.ts';

const APIRouter: Router = express.Router();

APIRouter.get('/blog-entries', APIController.getAllBlogs);
APIRouter.get('/blog-entries/search', APIController.searchBlogs);
APIRouter.get('/blog-entries/:id', APIController.getBlogById);

export default APIRouter;
