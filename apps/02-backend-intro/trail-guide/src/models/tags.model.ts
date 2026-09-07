import type { Tag } from '../types/types.ts';
import { getDB } from '../db/database.ts';
import type { Database } from 'sqlite';

export async function getAllTags(): Promise<Tag[]> {
  const db: Database = getDB();
  return db.all<Tag[]>(/* sql */ `
    SELECT
      *
    FROM
      tags
    ORDER BY
      name
  `);
}

export async function getTagsForTrail(trailId: number): Promise<Tag[]> {
  const db: Database = getDB();
  return db.all<Tag[]>(
    /* sql */ `
      SELECT
        tags.*
      FROM
        tags
        INNER JOIN trail_tags ON trail_tags.tag_id = tags.id
      WHERE
        trail_tags.trail_id = ?
      ORDER BY
        tags.name
    `,
    trailId,
  );
}

export async function setTagsForTrail(
  trailId: number,
  tagIds: number[],
): Promise<void> {
  const db: Database = getDB();
  await db.run(
    /* sql */ `
      DELETE FROM trail_tags
      WHERE
        trail_id = ?
    `,
    trailId,
  );

  for (const tagId of tagIds) {
    await db.run(
      /* sql */ `
        INSERT INTO
          trail_tags (trail_id, tag_id)
        VALUES
          (?, ?)
      `,
      trailId,
      tagId,
    );
  }
}

interface TrailTag extends Tag {
  trail_id: number;
}

// One query for all the given trails' tags, instead of one query per trail
// (real N+1 risk on any list view). Used by attachTagsToTrails below.
async function getTagsForTrails(trailIds: number[]): Promise<TrailTag[]> {
  if (trailIds.length === 0) {
    return [];
  }

  const db: Database = getDB();
  const placeholders = trailIds.map(() => '?').join(', ');
  return db.all<TrailTag[]>(
    /* sql */ `
      SELECT
        tags.*,
        trail_tags.trail_id
      FROM
        tags
        INNER JOIN trail_tags ON trail_tags.tag_id = tags.id
      WHERE
        trail_tags.trail_id IN (${placeholders})
      ORDER BY
        tags.name
    `,
    ...trailIds,
  );
}

// Shared by every controller that renders a list of trails
export async function attachTagsToTrails<T extends { id: number }>(
  trails: T[],
): Promise<(T & { tags: Tag[] })[]> {
  const tagRows = await getTagsForTrails(trails.map((trail) => trail.id));

  const tagsByTrailId = new Map<number, Tag[]>();
  for (const { trail_id, ...tag } of tagRows) {
    const tagsForThisTrail = tagsByTrailId.get(trail_id) ?? [];
    tagsForThisTrail.push(tag);
    tagsByTrailId.set(trail_id, tagsForThisTrail);
  }

  return trails.map((trail) => ({
    ...trail,
    tags: tagsByTrailId.get(trail.id) ?? [],
  }));
}
