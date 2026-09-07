import type { Request, Response } from 'express';
import {
  addTrail,
  deleteTrail,
  getAllTrails,
  getTrailById,
  getTrailsByRegionId,
  updateTrail,
} from '../../models/trails.model.ts';
import { formatDate, sanitizePostContent } from '../../utils/utils.ts';
import {
  addRegion,
  deleteRegion,
  getAllRegions,
} from '../../models/regions.model.ts';
import {
  getAllTags,
  getTagsForTrail,
  setTagsForTrail,
} from '../../models/tags.model.ts';
import type { Difficulty } from '../../types/types.ts';

// Checkbox inputs sharing one name come through as a single string when
// only one is checked, an array when several are, or missing entirely when
// none are — normalize all three into a plain number array.
function parseTagIds(raw: unknown): number[] {
  if (!raw) {
    return [];
  }
  const values = Array.isArray(raw) ? raw : [raw];
  return values.map(Number).filter((n) => !Number.isNaN(n));
}

// Shared by createTrail/updateTrailController (admin) and the API trail
// controller: resolves req.body down to a single region id, either the one
// picked from the <select> (or an equivalent region_id in a JSON body), or a
// brand-new region created on the fly if new_region_name (etc.) were filled
// in. Returns null if neither path produced a usable id.
export const resolveRegionId = async (
  body: Request['body'],
): Promise<number | null> => {
  const {
    region_id,
    new_region_name,
    new_region_country,
    new_region_description,
  } = body;

  if (new_region_name && new_region_name !== '') {
    return addRegion(
      new_region_name,
      new_region_country,
      new_region_description,
    );
  }

  const regionId = Number(region_id);
  return regionId || null;
};

interface ValidatedTrailFields {
  title: string;
  difficulty: Difficulty;
  distanceKm: number;
  description: string;
  image_url: string;
}

// Shared by createTrail and updateTrailController
function validateTrailFields(body: Request['body']):
  | {
      data: ValidatedTrailFields;
    }
  | { error: string } {
  const { title, difficulty, distance, description, image_url } = body;

  if (!title) {
    return { error: 'Title is required' };
  }

  const validDifficulties: Difficulty[] = ['easy', 'moderate', 'hard'];
  if (!validDifficulties.includes(difficulty)) {
    return { error: 'Choose trail difficulty' };
  }

  const distanceKm = Number(distance);
  if (!distance || Number.isNaN(distanceKm) || distanceKm < 0) {
    return { error: 'Please provide distance value >= 0' };
  }

  return { data: { title, difficulty, distanceKm, description, image_url } };
}

// Shared by createTrail/updateTrailController (admin) and the API trail
// controller
export const prepareTrailData = async (
  body: Request['body'],
): Promise<
  | { data: ValidatedTrailFields & { regionId: number } }
  | {
      error: string;
    }
> => {
  const validated = validateTrailFields(body);
  if ('error' in validated) {
    return validated;
  }

  const regionId = await resolveRegionId(body);
  if (!regionId) {
    return { error: 'Choose a region or provide a new one' };
  }

  return { data: { ...validated.data, regionId } };
};

export const adminController = async (req: Request, res: Response) => {
  const { q, region, difficulty, maxDistance } = req.query;
  const trails = await getAllTrails({
    q: q as string,
    regionSlug: region as string,
    difficulty: difficulty as string,
    maxDistance: maxDistance as string,
  });
  const sanitizedTrails = trails.map((trail) => ({
    ...trail,
    description: sanitizePostContent(trail.description),
    createdAt: formatDate(trail.created_at),
  }));
  const regions = await getAllRegions();

  res.render('admin/list.njk', {
    title: 'Trail Guide - Admin Dashboard',
    trails: sanitizedTrails,
    regions,
    filters: { q, region, difficulty, maxDistance },
  });
};

export const getNewTrailForm = async (_req: Request, res: Response) => {
  const regions = await getAllRegions();
  const tags = await getAllTags();
  res.render('admin/form.njk', {
    title: 'Trail Guide - Create new trail',
    regions,
    tags,
    selectedTagIds: [],
  });
};

export const getEditTrailForm = async (
  req: Request<{
    id: string;
  }>,
  res: Response,
) => {
  const trail = await getTrailById(req.params.id);

  if (!trail) {
    res.status(404).render('public/404.njk', { title: 'Trail not found' });
    return;
  }

  const regions = await getAllRegions();
  const tags = await getAllTags();
  const trailTags = await getTagsForTrail(trail.id);
  const selectedTagIds = trailTags.map((tag) => tag.id);

  res.render('admin/form.njk', {
    title: 'Trail Guide - Edit trail',
    trail,
    regions,
    tags,
    selectedTagIds,
  });
};

export const createTrailController = async (req: Request, res: Response) => {
  const prepared = await prepareTrailData(req.body);
  if ('error' in prepared) {
    res.status(400).send(prepared.error);
    return;
  }
  const { title, difficulty, distanceKm, description, image_url, regionId } =
    prepared.data;

  try {
    const newTrailId = await addTrail(
      regionId,
      title,
      difficulty,
      distanceKm,
      description,
      image_url,
    );
    await setTagsForTrail(newTrailId, parseTagIds(req.body.tags));
    res.status(201).redirect('/admin');
  } catch (err) {
    res.status(400).render('admin/form.njk', {
      error: (err as Error).message,
      trail: req.body,
    });
  }
};

export const updateTrailController = async (
  req: Request<{
    id: string;
  }>,
  res: Response,
): Promise<void> => {
  const id = req.params.id;

  if (!Number.isInteger(Number(id))) {
    res.status(400).send('Invalid id');
    return;
  }

  const existingTrail = await getTrailById(id);
  if (!existingTrail) {
    res.status(404).render('public/404.njk', { title: 'Trail not found' });
    return;
  }

  const prepared = await prepareTrailData(req.body);
  if ('error' in prepared) {
    res.status(400).send(prepared.error);
    return;
  }
  const { title, difficulty, distanceKm, description, image_url, regionId } =
    prepared.data;

  try {
    await updateTrail(id, {
      region_id: regionId,
      title,
      difficulty,
      distance_km: distanceKm,
      description: sanitizePostContent(description),
      image_url,
    });
    await setTagsForTrail(Number(id), parseTagIds(req.body.tags));
    res.redirect('/admin');
  } catch (err) {
    res.status(400).render('admin/form.njk', {
      error: (err as Error).message,
      trail: { ...req.body, id: existingTrail.id },
    });
  }
};

export const deleteTrailController = async (
  req: Request<{
    id: string;
  }>,
  res: Response,
): Promise<void> => {
  const id = req.params.id;

  if (!Number.isInteger(Number(id))) {
    res.status(400).send('Invalid id');
    return;
  }

  const trail = await getTrailById(id);
  if (!trail) {
    res.status(404).render('public/404.njk', { title: 'Trail not found' });
    return;
  }

  try {
    await deleteTrail(id);

    // If that was the last trail in this region, the region must also be deleted.
    const remainingTrailsInRegion = await getTrailsByRegionId(trail.region_id);
    if (remainingTrailsInRegion.length === 0) {
      await deleteRegion(trail.region_id);
    }
  } catch (err) {
    console.error(`Failed to delete trail with id "${id}":`, err);
  }

  res.redirect('/admin');
};
