import { Router } from 'express';
import {
  adminController,
  createTrailController,
  deleteTrailController,
  getEditTrailForm,
  getNewTrailForm,
  updateTrailController,
} from '../../controllers/admin/admin.controller.ts';

const adminRoute: Router = Router();

adminRoute.get('/', adminController);

adminRoute.get('/trails/new', getNewTrailForm);
adminRoute.post('/trails', createTrailController);
adminRoute.get('/trails/:id/edit', getEditTrailForm);
adminRoute.post('/trails/:id', updateTrailController);
adminRoute.post('/trails/:id/delete', deleteTrailController);

export default adminRoute;
