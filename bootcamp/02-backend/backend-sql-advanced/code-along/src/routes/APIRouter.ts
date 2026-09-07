import { Router } from 'express';
import * as APIController from '../controller/APIController.ts';
import * as AuthorController from '../controller/AuthorController.ts';

const APIRouter: Router = Router();

APIRouter.get('/blog-entries', APIController.getAllBlogs);
APIRouter.get('/blog-entries/search', APIController.searchBlogs);
APIRouter.get('/blog-entries/:id', APIController.getBlogById);
APIRouter.post('/blog-entries', APIController.createBlog);
APIRouter.put('/blog-entries/:id', APIController.updateBlog);
APIRouter.delete('/blog-entries/:id', APIController.deleteBlog);

APIRouter.get('/authors', AuthorController.getAllAuthors);

export default APIRouter;
