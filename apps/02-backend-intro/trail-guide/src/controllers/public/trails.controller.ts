import type { NextFunction, Request, Response } from 'express';
import { countTrails, getAllTrails } from '../../models/trails.model.ts';
import { attachTagsToTrails } from '../../models/tags.model.ts';
import { getAllRegions } from '../../models/regions.model.ts';

const trailsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { q, region, difficulty, maxDistance } = req.query;
  const page = Number(req.query['page']) || 1;
  const pageSize = Number(req.query['pageSize']) || 10;
  const filters = {
    q: q as string,
    regionSlug: region as string,
    difficulty: difficulty as string,
    maxDistance: maxDistance as string,
  };

  try {
    const [trails, total] = await Promise.all([
      getAllTrails({ ...filters, page, pageSize }),
      countTrails(filters),
    ]);
    const trailsWithTags = await attachTagsToTrails(trails);
    const regions = await getAllRegions();
    res.render('public/trails.njk', {
      title: `Trail Guide - All Trails`,
      trails: trailsWithTags,
      regions,
      filters: { q, region, difficulty, maxDistance },
      pagination: { page, pageSize, total },
    });
  } catch (err) {
    next(err);
  }
};

export default trailsController;
