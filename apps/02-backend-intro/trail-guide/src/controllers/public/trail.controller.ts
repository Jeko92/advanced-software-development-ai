import type { NextFunction, Request, Response } from 'express';
import { getAllTrails, getTrailBySlug } from '../../models/trails.model.ts';
import { getTagsForTrail } from '../../models/tags.model.ts';
import type { TrailViewModel } from '../../types/types.ts';
import { formatDate } from '../../utils/utils.ts';

const trailController = async (
  req: Request<{ slug: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug } = req.params;
    const trail = await getTrailBySlug(slug);

    if (!trail) {
      res.status(404).render('public/404.njk', { title: 'Trail not found' });
      return;
    }

    const trailWithTimestamp: TrailViewModel = {
      ...trail,
      createdAt: formatDate(trail.created_at),
    };

    const allTrails = await getAllTrails();
    const currentIndex = allTrails.findIndex((t) => t.slug === slug);
    const prevTrail = currentIndex > 0 ? allTrails[currentIndex - 1] : null;
    const nextTrail =
      currentIndex < allTrails.length - 1 ? allTrails[currentIndex + 1] : null;

    const tags = await getTagsForTrail(trail.id);

    res.render('public/trail.njk', {
      title: `Trail Guide - ${trail.title}`,
      trail: trailWithTimestamp,
      prevTrail,
      nextTrail,
      tags,
    });
  } catch (err) {
    next(err);
  }
};

export default trailController;
