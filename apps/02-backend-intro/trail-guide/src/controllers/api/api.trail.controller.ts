import type { NextFunction, Request, Response } from 'express';
import {
  addTrail,
  countTrails,
  deleteTrail,
  getAllTrails,
  getTrailById,
  getTrailBySlug,
  updateTrail,
} from '../../models/trails.model.ts';
import {
  attachTagsToTrails,
  getTagsForTrail,
} from '../../models/tags.model.ts';
import { prepareTrailData } from '../admin/admin.controller.ts';

export const getTrailsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query['page']) || 1;
    const pageSize = Number(req.query['pageSize']) || 10;
    const filters = {
      regionSlug: req.query['region'] as string,
      difficulty: req.query['difficulty'] as string,
      maxDistance: req.query['maxDistance'] as string,
      q: req.query['q'] as string,
    };

    const [trails, total] = await Promise.all([
      getAllTrails({ ...filters, page, pageSize }),
      countTrails(filters),
    ]);
    const items = await attachTagsToTrails(trails);

    res.json({ items, total, page, pageSize });
  } catch (err) {
    next(err);
  }
};

export const getTrailBySlugController = async (
  req: Request<{ slug: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const trail = await getTrailBySlug(req.params.slug);

    if (!trail) {
      res.status(404).json({ error: 'Trail not found' });
      return;
    }

    const tags = await getTagsForTrail(trail.id);
    res.json({ ...trail, tags });
  } catch (err) {
    next(err);
  }
};

export const createTrailApiController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const prepared = await prepareTrailData(req.body);
    if ('error' in prepared) {
      res.status(400).json({ error: prepared.error });
      return;
    }
    const { title, difficulty, distanceKm, description, image_url, regionId } =
      prepared.data;

    const newTrailId = await addTrail(
      regionId,
      title,
      difficulty,
      distanceKm,
      description,
      image_url,
    );
    const newTrail = await getTrailById(String(newTrailId));
    res.status(201).json(newTrail);
  } catch (err) {
    next(err);
  }
};

export const patchTrailApiController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const existingTrail = await getTrailById(id);

    if (!existingTrail) {
      res.status(404).json({ error: 'Trail not found' });
      return;
    }

    const prepared = await prepareTrailData(req.body);
    if ('error' in prepared) {
      res.status(400).json({ error: prepared.error });
      return;
    }
    const { title, difficulty, distanceKm, description, image_url, regionId } =
      prepared.data;

    await updateTrail(id, {
      region_id: regionId,
      title,
      difficulty,
      distance_km: distanceKm,
      description,
      image_url,
    });
    const updatedTrail = await getTrailById(id);
    res.status(200).json(updatedTrail);
  } catch (err) {
    next(err);
  }
};

export const deleteTrailApiController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const existingTrail = await getTrailById(id);

    if (!existingTrail) {
      res.status(404).json({ error: 'Trail not found' });
      return;
    }

    await deleteTrail(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
