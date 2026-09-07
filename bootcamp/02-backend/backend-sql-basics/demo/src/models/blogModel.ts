import { getDatabase } from '../db/database.ts';
import { sql } from '../db/sql.ts';

export type BlogPosting = {
  id: number;
  title: string;
  content: string;
};

export async function getAllBlogsPostings(): Promise<BlogPosting[]> {
  const db = getDatabase();

  return await db.all<BlogPosting[]>(sql`
    SELECT
      *
    FROM
      posting
  `);
}

export async function getBlogPostingById(
  id: number,
): Promise<BlogPosting | undefined> {
  const db = getDatabase();

  return await db.get<BlogPosting>(
    sql`
      SELECT
        *
      FROM
        posting
      WHERE
        id = ?
    `,
    id,
  );
}
