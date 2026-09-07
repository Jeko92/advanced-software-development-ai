import { Router } from 'express';
import {
  getAdminDashboard,
  getNewPostForm,
  createPost,
  getEditPostForm,
  updatePostHandler,
  deletePostHandler,
} from '../../controllers/admin/admin.controller.ts';
import {
  getAdminAuthors,
  createAuthorHandler,
  deleteAuthorHandler,
} from '../../controllers/admin/authors.controller.ts';
import { upload } from '../../middlewares/upload.ts';

const adminRoute: Router = Router();

adminRoute.get('/', getAdminDashboard);
adminRoute.get('/posts/new', getNewPostForm);
adminRoute.post('/posts', upload.single('image'), createPost);
adminRoute.get('/posts/:slug/edit', getEditPostForm);
adminRoute.post('/posts/:slug', upload.single('image'), updatePostHandler);
adminRoute.post('/posts/:slug/delete', deletePostHandler);

adminRoute.get('/authors', getAdminAuthors);
adminRoute.post('/authors', createAuthorHandler);
adminRoute.post('/authors/:id/delete', deleteAuthorHandler);

export default adminRoute;
