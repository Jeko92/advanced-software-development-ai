import Database from '../db/Databse.ts';

export interface Author {
  id?: number;
  name: string;
}

export async function loadAuthors(): Promise<Author[]> {
  const db = Database.getInstance().getConnection();
  return db.all<Author[]>('SELECT * FROM authors ORDER BY name ASC');
}

export async function getAuthorById(id: number): Promise<Author | undefined> {
  const db = Database.getInstance().getConnection();
  return db.get<Author>('SELECT * FROM authors WHERE id = ?', id);
}

export async function createAuthor(name: string): Promise<number> {
  const db = Database.getInstance().getConnection();
  const result = await db.run('INSERT INTO authors (name) VALUES (?)', name);

  if (result.lastID === undefined) {
    throw new Error('Failed to determine the new author id');
  }

  return result.lastID;
}

export async function updateAuthor(id: number, name: string): Promise<void> {
  const db = Database.getInstance().getConnection();
  const result = await db.run(
    'UPDATE authors SET name = ? WHERE id = ?',
    name,
    id,
  );

  if (!result.changes) {
    throw new Error(`Author with id ${id} not found`);
  }
}

export async function deleteAuthor(id: number): Promise<void> {
  const db = Database.getInstance().getConnection();
  const result = await db.run('DELETE FROM authors WHERE id = ?', id);

  if (!result.changes) {
    throw new Error(`Author with id ${id} not found`);
  }
}
