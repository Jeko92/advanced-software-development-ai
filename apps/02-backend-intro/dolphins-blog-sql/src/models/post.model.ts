import { getDB } from '../db/database.ts';

export interface Post {
  id?: number;
  title: string;
  image: string;
  author: string;
  author_id?: number | null;
  createdAt: number;
  teaser: string;
  content: string;
  slug?: string;
}

export interface PostWithAuthor extends Post {
  authorName: string | null;
}

export interface PostWithNeighbors {
  post: Post;
  previousPost: Post | null;
  nextPost: Post | null;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function loadPosts(): Promise<Post[]> {
  const db = await getDB();
  return db.all<Post[]>(/* sql */ `
    SELECT
      *
    FROM
      posting
    ORDER BY
      createdAt DESC
  `);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const db = getDB();
  return db.get<Post>(
    /* sql */ `
      SELECT
        *
      FROM
        posting
      WHERE
        slug = ?
    `,
    slug,
  );
}

export async function addPost(post: Post): Promise<void> {
  const db = getDB();
  const slug = slugify(post.title);

  const existing = await getPostBySlug(slug);
  if (existing) {
    throw new Error(`Post with slug "${slug}" already exists`);
  }

  await db.run(
    /* sql */ `
      INSERT INTO
        posting (
          image,
          author,
          createdAt,
          teaser,
          title,
          content,
          slug
        )
      VALUES
        (?, ?, ?, ?, ?, ?, ?)
    `,
    post.image,
    post.author,
    post.createdAt,
    post.teaser,
    post.title,
    post.content,
    slug,
  );
}

export async function updatePost(
  slug: string,
  changes: Partial<Post>,
): Promise<void> {
  const db = getDB();
  const existing = await getPostBySlug(slug);

  if (!existing) {
    throw new Error(`Post with slug "${slug}" not found`);
  }

  // Drop `undefined` entries before merging — see updateBlogEntry() below.
  const definedChanges = Object.fromEntries(
    Object.entries(changes).filter(([, value]) => value !== undefined),
  );
  const updated = { ...existing, ...definedChanges };
  const newSlug = changes.title ? slugify(changes.title) : existing.slug;

  await db.run(
    /* sql */ `
      UPDATE posting
      SET
        image = ?,
        author = ?,
        createdAt = ?,
        teaser = ?,
        title = ?,
        content = ?,
        slug = ?
      WHERE
        id = ?
    `,
    updated.image,
    updated.author,
    updated.createdAt,
    updated.teaser,
    updated.title,
    updated.content,
    newSlug,
    existing.id,
  );
}

export async function deletePost(slug: string): Promise<void> {
  const db = getDB();
  const result = await db.run(
    /* sql */ `
      DELETE FROM posting
      WHERE
        slug = ?
    `,
    slug,
  );

  if (!result.changes) {
    throw new Error(`Post with slug "${slug}" not found`);
  }
}

/**
 * Extended Answer to Challenges.md #1 (Full CRUD): id-scoped create, used by
 * the JSON API. The admin HTML flow keeps using the slug-scoped addPost
 * above unchanged.
 */
export async function createBlogEntry(
  entry: Omit<Post, 'id' | 'slug'>,
): Promise<number> {
  const db = getDB();
  const slug = slugify(entry.title);

  const existing = await getPostBySlug(slug);
  if (existing) {
    throw new Error(`Post with slug "${slug}" already exists`);
  }

  const result = await db.run(
    /* sql */ `
      INSERT INTO
        posting (
          image,
          author,
          author_id,
          createdAt,
          teaser,
          title,
          content,
          slug
        )
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    entry.image,
    entry.author,
    entry.author_id ?? null,
    entry.createdAt,
    entry.teaser,
    entry.title,
    entry.content,
    slug,
  );

  if (result.lastID === undefined) {
    throw new Error('Failed to determine the new post id');
  }

  return result.lastID;
}

/**
 * Challenges.md #1: id-scoped update.
 */
export async function updateBlogEntry(
  id: number,
  changes: Partial<Omit<Post, 'id' | 'slug'>>,
): Promise<void> {
  const db = getDB();
  const existing = await db.get<Post>(
    /* sql */ `
      SELECT
        *
      FROM
        posting
      WHERE
        id = ?
    `,
    id,
  );

  if (!existing) {
    throw new Error(`Post with id ${id} not found`);
  }

  // Drop `undefined` entries before merging — otherwise an explicit
  // `{ author: undefined }` in `changes` would overwrite the existing NOT
  // NULL column instead of leaving it untouched.
  const definedChanges = Object.fromEntries(
    Object.entries(changes).filter(([, value]) => value !== undefined),
  );
  const updated = { ...existing, ...definedChanges };
  const newSlug = changes.title ? slugify(changes.title) : existing.slug;

  await db.run(
    /* sql */ `
      UPDATE posting
      SET
        image = ?,
        author = ?,
        author_id = ?,
        createdAt = ?,
        teaser = ?,
        title = ?,
        content = ?,
        slug = ?
      WHERE
        id = ?
    `,
    updated.image,
    updated.author,
    updated.author_id ?? null,
    updated.createdAt,
    updated.teaser,
    updated.title,
    updated.content,
    newSlug,
    id,
  );
}

/**
 * Challenges.md #1: id-scoped delete.
 */
export async function deleteBlogEntry(id: number): Promise<void> {
  const db = getDB();
  const result = await db.run(
    /* sql */ `
      DELETE FROM posting
      WHERE
        id = ?
    `,
    id,
  );

  if (!result.changes) {
    throw new Error(`Post with id ${id} not found`);
  }
}

/**
 * Challenges.md #2 (Optional: Authors table and JOIN).
 */
export async function loadPostsWithAuthors(): Promise<PostWithAuthor[]> {
  const db = getDB();
  return db.all<PostWithAuthor[]>(/* sql */ `
    SELECT
      posting.*,
      authors.name AS authorName
    FROM
      posting
      LEFT JOIN authors ON posting.author_id = authors.id
    ORDER BY
      posting.createdAt DESC
  `);
}

export async function getPostWithNeighbors(
  slug: string,
): Promise<PostWithNeighbors | undefined> {
  const posts = await loadPosts();
  const index = posts.findIndex((p) => p.slug === slug);

  if (index === -1) return undefined;

  const post = posts[index];
  if (!post) return undefined;

  return {
    post,
    previousPost: index < posts.length - 1 ? (posts[index + 1] ?? null) : null,
    nextPost: index > 0 ? (posts[index - 1] ?? null) : null,
  };
}
