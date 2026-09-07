import type { Request, Response } from 'express';
import { getAllRegions } from '../../models/regions.model';
import type { Region } from '../../types/types';

const regionsController = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const regions: Region[] = await getAllRegions();
  res.render('public/regions.njk', { title: 'Trail Guide - Regions', regions });
};

export default regionsController;
