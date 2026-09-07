import { getDB } from '../db/database.ts';

export type Author = {
  id: number;
  name: string;
  email: string;
};

export type AuthorWithProfile = Author & {
  bio: string | null;
  avatarUrl: string | null;
};

// LEFT JOIN keeps every author even when author_profiles has no matching
// row (see db/seeddb.sql — Ben has no profile), so bio/avatarUrl come back
// as NULL for him instead of dropping the row like an INNER JOIN would.
export async function getAllAuthorsWithProfiles(): Promise<
  AuthorWithProfile[]
> {
  const db = getDB();
  return await db.all<AuthorWithProfile[]>(/* sql */ `
    SELECT
      authors.id,
      authors.name,
      authors.email,
      author_profiles.bio,
      author_profiles.avatar_url AS avatarUrl
    FROM
      authors
      LEFT JOIN author_profiles ON authors.id = author_profiles.author_id
  `);
}
