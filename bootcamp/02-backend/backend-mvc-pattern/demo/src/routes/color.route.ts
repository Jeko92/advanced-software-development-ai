import { Router } from 'express';
import {
  listColors,
  getAllColorsJson,
  getRandomColorJson,
  getColorByIdJson,
} from '../controllers/color.controller';

const colors: Router = Router();

colors.get('/', listColors);
colors.get('/all', getAllColorsJson);
colors.get('/random', getRandomColorJson);
colors.get('/:id', getColorByIdJson);

export default colors;
