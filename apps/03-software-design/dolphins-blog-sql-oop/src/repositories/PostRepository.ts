import Database from '../db/Databse.ts';
import type { IPostRepository } from './IPostRepository.ts';
import { slugify, type Post, type PostWithAuthor, type PostWithNeighbors } from '../entities/Post.ts';

export class PostRepository implements IPostRepository {
  constructor(private readonly database: Database) {}

  async loadPosts(): Promise<Post[]> {
    return this.database.getConnection().all<Post[]>(
      /* sql */ `
    SELECT
      *
    FROM
      posting
    ORDER BY
      createdAt DESC
  `
    );
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    const db = Database.getInstance().getConnection();
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

  async addPost(post: Post): Promise<void> {
    const db = Database.getInstance().getConnection();
    const slug = slugify(post.title);

    const existing = await this.getPostBySlug(slug);
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

  async updatePost(
    slug: string,
    changes: Partial<Post>,
  ): Promise<void> {
    const db = Database.getInstance().getConnection();
    const existing = await this.getPostBySlug(slug);

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

  async deletePost(slug: string): Promise<void> {
    const db = Database.getInstance().getConnection();
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
  async createBlogEntry(
    entry: Omit<Post, 'id' | 'slug'>,
  ): Promise<number> {
    const db = Database.getInstance().getConnection();
    const slug = slugify(entry.title);

    const existing = await this.getPostBySlug(slug);
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
  async updateBlogEntry(
    id: number,
    changes: Partial<Omit<Post, 'id' | 'slug'>>,
  ): Promise<void> {
    const db = Database.getInstance().getConnection();
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
  async deleteBlogEntry(id: number): Promise<void> {
    const db = Database.getInstance().getConnection();
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
  async loadPostsWithAuthors(): Promise<PostWithAuthor[]> {
    const db = Database.getInstance().getConnection();
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

  async getPostWithNeighbors(
    slug: string,
  ): Promise<PostWithNeighbors | undefined> {
    const posts = await this.loadPosts();
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
}
