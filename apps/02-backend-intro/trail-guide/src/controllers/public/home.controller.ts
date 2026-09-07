import type { NextFunction, Request, Response } from 'express';
import { getAllTrails } from '../../models/trails.model.ts';
import { attachTagsToTrails } from '../../models/tags.model.ts';
import type { TrailWithRegion } from '../../types/types.ts';

const homeController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const trails: TrailWithRegion[] = await getAllTrails({
      page: 1,
      pageSize: 3,
    });
    const trailsWithTags = await attachTagsToTrails(trails);
    res.render('public/home.njk', {
      title: 'Trail Guide',
      trails: trailsWithTags,
    });
  } catch (err) {
    next(err);
  }
};

export default homeController;
