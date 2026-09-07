import { getDB } from '../db/database.ts';
import { sql } from '../db/sql.ts';

export type Post = {
  id: number;
  title: string;
  content: string;
};

export async function getAllPosts(): Promise<Post[]> {
  const db = getDB();

  return await db.all<Post[]>(sql`
    SELECT
      *
    FROM
      posts
  `);
}

export async function getPostById(id: number): Promise<Post | undefined> {
  const db = getDB();

  return await db.get<Post>(
    sql`
      SELECT
        *
      FROM
        posts
      WHERE
        id = ?
    `,
    id,
  );
}
