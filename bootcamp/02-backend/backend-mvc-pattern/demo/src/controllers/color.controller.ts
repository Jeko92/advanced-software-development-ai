import type { Request, Response } from 'express';
import {
  getAllColors,
  getColorById,
  getRandomColor,
} from '../models/color.model.ts';

export function listColors(_req: Request, res: Response) {
  const colors = getAllColors();
  res.render('colors.njk', { title: 'Colors', colors });
}

export function getAllColorsJson(_req: Request, res: Response) {
  const colors = getAllColors();

  if (colors.length === 0) {
    res.status(400).send('No colors found');
    return;
  }

  res.json(colors);
}

export function getRandomColorJson(_req: Request, res: Response) {
  const randomColor = getRandomColor();
  res.json(randomColor);
}

export function getColorByIdJson(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;
  const numId = Number(id);

  if (isNaN(numId)) {
    res.status(400).json({ message: 'bad request' });
    return;
  }

  const color = getColorById(numId);

  if (!color) {
    res.status(404).json({ message: 'Color not found' });
    return;
  }

  res.json(color);
}
