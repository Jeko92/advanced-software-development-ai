import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { BlogEntry } from '../types/blog.js';
import { slugifyTitle } from './slug.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface BlogPost extends BlogEntry {
  slug: string;
  formattedDate: string;
}

function formatDate(unixTimestamp: number): string {
  return new Date(unixTimestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function getBlogEntries(): Promise<BlogPost[]> {
  const dataPath = path.join(__dirname, '../data/blog-entries.json');
  const raw = await readFile(dataPath, 'utf-8');
  const entries: BlogEntry[] = JSON.parse(raw);

  return (
    entries
      .map((entry) => ({
        ...entry,
        slug: slugifyTitle(entry.title),
        formattedDate: formatDate(entry.createdAt),
      }))
      // newest first — same order the homepage uses
      .sort((a, b) => b.createdAt - a.createdAt)
  );
}

export async function getBlogEntryBySlug(
  slug: string,
): Promise<BlogPost | undefined> {
  const entries = await getBlogEntries();
  return entries.find((entry) => entry.slug === slug);
}

export interface PostWithNeighbors {
  post: BlogPost;
  newerPost: BlogPost | null;
  olderPost: BlogPost | null;
}

export async function getPostWithNeighbors(
  slug: string,
): Promise<PostWithNeighbors | undefined> {
  const entries = await getBlogEntries();
  const index = entries.findIndex((entry) => entry.slug === slug);

  if (index === -1) return undefined;

  const post = entries[index];

  if (!post) return undefined;

  return {
    post,
    newerPost: index > 0 ? (entries[index - 1] ?? null) : null,
    olderPost: index < entries.length - 1 ? (entries[index + 1] ?? null) : null,
  };
}
