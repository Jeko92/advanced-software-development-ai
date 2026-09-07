import type { NextFunction, Request, Response } from 'express';
import { getAllRegions, getRegionBySlug } from '../../models/regions.model.ts';
import { getTrailsByRegionId } from '../../models/trails.model.ts';

export const getRegionsController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const regions = await getAllRegions();
    res.json(regions);
  } catch (err) {
    next(err);
  }
};

export const getTrailsByRegionIdController = async (
  req: Request<{ slug: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const region = await getRegionBySlug(req.params.slug);

    if (!region) {
      res.status(404).json({ error: 'Region not found' });
      return;
    }

    const trails = await getTrailsByRegionId(region.id);
    res.json(trails);
  } catch (err) {
    next(err);
  }
};
