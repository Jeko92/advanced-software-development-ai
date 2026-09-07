import type { Region } from '../types/types.ts';
import { getDB } from '../db/database.ts';
import type { Database } from 'sqlite';
import { sanitizePostContent, slugify } from '../utils/utils.ts';

// image_url is borrowed from the region's own first trail so cards have a
// picture without needing a separate image field on the region itself.
export async function getAllRegions(): Promise<Region[]> {
  const db: Database = getDB();
  return db.all<Region[]>(/* sql */ `
    SELECT
      regions.*,
      (
        SELECT
          image_url
        FROM
          trails
        WHERE
          trails.region_id = regions.id
        ORDER BY
          id
        LIMIT
          1
      ) AS image_url
    FROM
      regions
    ORDER BY
      name
  `);
}

export async function getRegionBySlug(
  slug: string,
): Promise<Region | undefined> {
  const db: Database = getDB();
  return db.get<Region>(
    /* sql */ `
      SELECT
        *
      FROM
        regions
      WHERE
        slug = ?
    `,
    slug,
  );
}

// sanitized here, not in the controller, since this fn is also the intended write path for the future API
export async function addRegion(
  name: string,
  country: string,
  description: string,
): Promise<number> {
  const slug = slugify(name);
  const sanitizedDescription = sanitizePostContent(description);
  const db: Database = getDB();

  const lastId = (
    await db.run(
      /* sql */ `
        INSERT INTO
          regions (name, slug, country, description)
        VALUES
          (?, ?, ?, ?)
      `,
      name,
      slug,
      country,
      sanitizedDescription,
    )
  ).lastID;

  if (lastId) {
    return lastId;
  }

  return 0;
}

export async function deleteRegion(id: number): Promise<void> {
  const db: Database = getDB();
  await db.run(
    /* sql */ `
      DELETE FROM regions
      WHERE
        id = ?
    `,
    id,
  );
}
