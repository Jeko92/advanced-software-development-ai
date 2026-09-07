import type { Difficulty, Trail, TrailWithRegion } from '../types/types.ts';
import { getDB } from '../db/database.ts';
import type { Database } from 'sqlite';
import { sanitizePostContent, slugify } from '../utils/utils.ts';

export interface TrailFilters {
  regionSlug?: string;
  difficulty?: string;
  maxDistance?: string;
  q?: string;
}

// Shared by getAllTrails and countTrails: both need the exact same WHERE clause. (one with ORDER BY one without)
function buildTrailFilterClause(filters?: TrailFilters): {
  whereClause: string;
  values: (string | number)[];
} {
  const conditions: string[] = [];
  const values: (string | number)[] = [];

  if (filters?.regionSlug) {
    conditions.push('regions.slug = ?');
    values.push(filters.regionSlug);
  }

  if (filters?.difficulty) {
    conditions.push('trails.difficulty = ?');
    values.push(filters.difficulty);
  }

  if (filters?.maxDistance) {
    conditions.push('trails.distance_km <= ?');
    values.push(Number(filters.maxDistance));
  }

  if (filters?.q) {
    conditions.push('trails.title LIKE ?');
    values.push(`%${filters.q}%`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : '';
  return { whereClause, values };
}

export async function getAllTrails(
  filters?: TrailFilters & { page?: number; pageSize?: number },
): Promise<TrailWithRegion[]> {
  const db: Database = getDB();
  const { whereClause, values } = buildTrailFilterClause(filters);

  // Pagination is opt-in: only applied LIMIT/OFFSET when the caller actually asks for a page.
  let limitClause = '';
  const limitValues: number[] = [];
  if (filters?.page || filters?.pageSize) {
    const pageSize = filters.pageSize ?? 10;
    const page = filters.page ?? 1;
    limitClause = 'LIMIT ? OFFSET ?';
    limitValues.push(pageSize, (page - 1) * pageSize);
  }

  return db.all<TrailWithRegion[]>(
    /* sql */ `
      SELECT
        trails.*,
        regions.slug AS region_slug,
        regions.name AS region_name,
        regions.country AS region_country
      FROM
        trails
        INNER JOIN regions ON trails.region_id = regions.id ${whereClause}
      ORDER BY
        trails.created_at DESC ${limitClause};
    `,
    ...values,
    ...limitValues,
  );
}

export async function countTrails(filters?: TrailFilters): Promise<number> {
  const db: Database = getDB();
  const { whereClause, values } = buildTrailFilterClause(filters);

  const result = await db.get<{ count: number }>(
    /* sql */ `
      SELECT
        COUNT(*) AS count
      FROM
        trails
        INNER JOIN regions ON trails.region_id = regions.id ${whereClause};
    `,
    ...values,
  );

  return result?.count ?? 0;
}

export async function getTrailBySlug(
  slug: string,
): Promise<TrailWithRegion | undefined> {
  const db: Database = getDB();
  return db.get<TrailWithRegion>(
    /* sql */ `
      SELECT
        trails.*,
        regions.slug AS region_slug,
        regions.name AS region_name,
        regions.country AS region_country
      FROM
        trails
        INNER JOIN regions ON trails.region_id = regions.id
      WHERE
        trails.slug = ?
    `,
    slug,
  );
}

export async function getTrailsByRegionId(
  regionId: number,
): Promise<TrailWithRegion[]> {
  const db: Database = getDB();
  return db.all<TrailWithRegion[]>(
    /* sql */ `
      SELECT
        trails.*,
        regions.slug AS region_slug,
        regions.name AS region_name,
        regions.country AS region_country
      FROM
        trails
        INNER JOIN regions ON trails.region_id = regions.id
      WHERE
        trails.region_id = ?
    `,
    regionId,
  );
}

// Admin handlers
export async function getTrailById(id: string): Promise<Trail | undefined> {
  const db: Database = getDB();
  return db.get<Trail>(
    /* sql */ `
      SELECT
        *
      FROM
        trails
      WHERE
        id = ?
    `,
    id,
  );
}

export async function addTrail(
  regionId: number,
  title: string,
  difficulty: Difficulty,
  distance: number,
  description: string,
  image_url: string,
): Promise<number> {
  const db: Database = getDB();
  const slug = slugify(title);

  const trailExists = await db.get<Trail>(
    /* sql */ `
      SELECT
        *
      FROM
        trails
      WHERE
        slug = ?
    `,
    slug,
  );
  if (trailExists) {
    throw new Error(`Trail with slug ${slug} already exists`);
  }

  // sanitized here, not in the controller, since this fn is also the intended write path for the future API
  const sanitizedDescription = sanitizePostContent(description);
  const createdAt = Math.floor(Date.now() / 1000);

  const result = await db.run(
    /* sql */ `
      INSERT INTO
        trails (
          title,
          slug,
          region_id,
          difficulty,
          distance_km,
          description,
          image_url,
          created_at
        )
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    title,
    slug,
    regionId,
    difficulty,
    distance,
    sanitizedDescription,
    image_url,
    createdAt,
  );

  return result.lastID ?? 0;
}

export async function updateTrail(
  id: string,
  changes: Partial<Trail>,
): Promise<void> {
  const db = getDB();
  const existing = await getTrailById(id);

  if (!existing) {
    throw new Error(`Trail with id "${id}" not found`);
  }

  const updated = { ...existing, ...changes };
  // created_at is deliberately never part of an update — it's the trail's
  // original creation time, not something an edit should be able to touch.
  const newSlug = changes.title ? slugify(changes.title) : existing.slug;

  await db.run(
    /* sql */ `
      UPDATE trails
      SET
        region_id = ?,
        title = ?,
        slug = ?,
        difficulty = ?,
        distance_km = ?,
        description = ?,
        image_url = ?
      WHERE
        id = ?
    `,
    updated.region_id,
    updated.title,
    newSlug,
    updated.difficulty,
    updated.distance_km,
    updated.description,
    updated.image_url,
    existing.id,
  );
}

export async function deleteTrail(id: string): Promise<void> {
  const db = getDB();
  const result = await db.run(
    /* sql */ `
      DELETE FROM trails
      WHERE
        id = ?
    `,
    id,
  );

  if (!result.changes) {
    throw new Error(`trail with id "${id}" not found`);
  }
}
