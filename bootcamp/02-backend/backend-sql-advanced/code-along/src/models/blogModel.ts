import { getDB } from '../db/database.ts';

export type BlogEntry = {
  id: number;
  title: string;
  teaser: string;
  authorName: string;
  createdAt: string;
  image: string;
  content: string;
};

export type BlogEntryDetail = BlogEntry & {
  tags: string[];
};

// Column list shared by getAllBlogEntries and searchBlogEntries, joined
// against authors so each row carries the author's name, not just their id.
const SELECT_BLOG_ENTRIES = /* sql */ `
  SELECT
    blog_entries.id,
    blog_entries.title,
    blog_entries.teaser,
    authors.name AS authorName,
    blog_entries.createdAt,
    blog_entries.image,
    blog_entries.content
  FROM
    blog_entries
    INNER JOIN authors ON blog_entries.author_id = authors.id
`;

export async function getAllBlogEntries(): Promise<BlogEntry[]> {
  const db = getDB();
  return await db.all<BlogEntry[]>(/* sql */ `
    ${SELECT_BLOG_ENTRIES}
    ORDER BY
      blog_entries.createdAt DESC
  `);
}

export async function getBlogEntryById(
  id: number,
): Promise<BlogEntryDetail | undefined> {
  const db = getDB();
  const entry = await db.get<BlogEntry>(
    /* sql */ `
      ${SELECT_BLOG_ENTRIES}
      WHERE
        blog_entries.id = ?
    `,
    [id],
  );

  if (!entry) {
    return undefined;
  }

  return { ...entry, tags: await getTagsForBlogEntry(id) };
}

// Many-to-many: two INNER JOINs walk blog_entries -> blog_entry_tags -> tags.
async function getTagsForBlogEntry(blogEntryId: number): Promise<string[]> {
  const db = getDB();
  const rows = await db.all<{ name: string }[]>(
    /* sql */ `
      SELECT
        tags.name
      FROM
        blog_entry_tags
        INNER JOIN tags ON blog_entry_tags.tag_id = tags.id
      WHERE
        blog_entry_tags.blog_entry_id = ?
    `,
    [blogEntryId],
  );
  return rows.map((row: { name: string }) => row.name);
}

export type BlogEntrySearchFilters = {
  author?: string | undefined;
  search?: string | undefined;
  direction?: 'ASC' | 'DESC' | undefined;
  limit?: number | undefined;
};

export async function searchBlogEntries(
  filters: BlogEntrySearchFilters,
): Promise<BlogEntry[]> {
  const db = getDB();

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (filters.author) {
    conditions.push('authors.name = ?');
    params.push(filters.author);
  }

  if (filters.search) {
    conditions.push('blog_entries.title LIKE ?');
    params.push(`%${filters.search}%`);
  }

  // Built up dynamically below, so it isn't a single literal prettier-plugin-embed
  // can format as one block — the /* sql */ tag only applies to static queries.
  let query = SELECT_BLOG_ENTRIES;

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  const direction = filters.direction === 'ASC' ? 'ASC' : 'DESC';
  query += ` ORDER BY blog_entries.createdAt ${direction}`;

  if (filters.limit) {
    query += ' LIMIT ?';
    params.push(filters.limit);
  }

  return await db.all<BlogEntry[]>(query, params);
}

export type BlogEntryInput = {
  title: string;
  teaser: string;
  authorId: number;
  createdAt: string;
  image: string;
  content: string;
};

export async function createBlogEntry(entry: BlogEntryInput): Promise<number> {
  const db = getDB();
  // No /* sql */ tag: prettier-plugin-embed's sql-formatter can't parse
  // SQLite's @named placeholders and errors out on them.
  const result = await db.run(
    `
      INSERT INTO
        blog_entries (title, teaser, author_id, createdAt, image, content)
      VALUES
        (@title, @teaser, @authorId, @createdAt, @image, @content)
    `,
    {
      '@title': entry.title,
      '@teaser': entry.teaser,
      '@authorId': entry.authorId,
      '@createdAt': entry.createdAt,
      '@image': entry.image,
      '@content': entry.content,
    },
  );
  return result.lastID!;
}

export async function updateBlogEntry(
  id: number,
  entry: BlogEntryInput,
): Promise<void> {
  const db = getDB();
  // No /* sql */ tag here either, same reason as createBlogEntry above.
  await db.run(
    `
      UPDATE blog_entries
      SET
        title = @title,
        teaser = @teaser,
        author_id = @authorId,
        createdAt = @createdAt,
        image = @image,
        content = @content
      WHERE
        id = @id
    `,
    {
      '@title': entry.title,
      '@teaser': entry.teaser,
      '@authorId': entry.authorId,
      '@createdAt': entry.createdAt,
      '@image': entry.image,
      '@content': entry.content,
      '@id': id,
    },
  );
}

export async function deleteBlogEntry(id: number): Promise<void> {
  const db = getDB();
  await db.run(`DELETE FROM blog_entries WHERE id = @id`, {
    '@id': id,
  });
}
