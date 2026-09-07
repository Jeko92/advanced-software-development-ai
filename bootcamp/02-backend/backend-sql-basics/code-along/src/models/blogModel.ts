import { getDB } from '../db/database';

export type BlogEntry = {
  id: number;
  title: string;
  teaser: string;
  author: string;
  createdAt: string;
  image: string;
  content: string;
};

export async function getAllBlogEntries(): Promise<BlogEntry[]> {
  const db = getDB();
  return await db.all<BlogEntry[]>(/* sql */ `
    SELECT
      *
    FROM
      blog_entries
  `);
}

export async function getBlogEntryById(
  id: number,
): Promise<BlogEntry | undefined> {
  const db = getDB();
  return await db.get<BlogEntry>(
    /* sql */ `
      SELECT
        *
      FROM
        blog_entries
      WHERE
        id = ?
    `,
    [id],
  );
}

export type BlogEntrySearchFilters = {
  author?: string;
  search?: string;
  direction?: 'ASC' | 'DESC';
  limit?: number;
};

export async function searchBlogEntries(
  filters: BlogEntrySearchFilters,
): Promise<BlogEntry[]> {
  const db = getDB();

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (filters.author) {
    conditions.push('author = ?');
    params.push(filters.author);
  }

  if (filters.search) {
    conditions.push('title LIKE ?');
    params.push(`%${filters.search}%`);
  }

  // Built up dynamically below, so it isn't a single literal prettier-plugin-embed
  // can format as one block — the /* sql */ tag only applies to static queries.
  let query = 'SELECT * FROM blog_entries';

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  const direction = filters.direction === 'ASC' ? 'ASC' : 'DESC';
  query += ` ORDER BY createdAt ${direction}`;

  if (filters.limit) {
    query += ' LIMIT ?';
    params.push(filters.limit);
  }

  return await db.all<BlogEntry[]>(query, params);
}
