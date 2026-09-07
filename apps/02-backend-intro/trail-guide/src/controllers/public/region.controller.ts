import type { NextFunction, Request, Response } from 'express';
import { getAllRegions, getRegionBySlug } from '../../models/regions.model.ts';
import { getTrailsByRegionId } from '../../models/trails.model.ts';
import { attachTagsToTrails } from '../../models/tags.model.ts';

const regionController = async (
  req: Request<{ slug: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug } = req.params;
    const region = await getRegionBySlug(slug);

    if (!region) {
      res.status(404).render('public/404.njk', { title: 'Region not found' });
      return;
    }

    const regionTrails = await getTrailsByRegionId(region.id);
    const trails = await attachTagsToTrails(regionTrails);

    const allRegions = await getAllRegions();
    const currentIndex = allRegions.findIndex((r) => r.slug === slug);
    const prevRegion = currentIndex > 0 ? allRegions[currentIndex - 1] : null;
    const nextRegion =
      currentIndex < allRegions.length - 1
        ? allRegions[currentIndex + 1]
        : null;

    res.render('public/region.njk', {
      title: `Trail Guide - ${region.name}`,
      region,
      trails,
      prevRegion,
      nextRegion,
    });
  } catch (err) {
    next(err);
  }
};

export default regionController;
