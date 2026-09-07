import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { access, readFile, writeFile, mkdir } from 'node:fs/promises';

export interface Post {
  title: string;
  image: string;
  author: string;
  createdAt: number;
  teaser: string;
  content: string;
  slug?: string;
}

export interface PostWithNeighbors {
  post: Post;
  previousPost: Post | null;
  nextPost: Post | null;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, '..', 'data');
const POSTS_FILE = path.join(POSTS_DIR, 'posts.json');

async function ensurePostsFile(): Promise<void> {
  await mkdir(POSTS_DIR, { recursive: true });
  try {
    await access(POSTS_FILE);
  } catch {
    await writeFile(POSTS_FILE, '[]', 'utf-8');
  }
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function loadPosts(): Promise<Post[]> {
  await ensurePostsFile();
  const raw = await readFile(POSTS_FILE, { encoding: 'utf-8' });
  const posts: Post[] = JSON.parse(raw);
  return posts.map((p) => ({ ...p, slug: slugify(p.title) }));
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await loadPosts();
  return posts.find((p) => p.slug === slug);
}

export async function writePosts(posts: Post[]): Promise<void> {
  await ensurePostsFile();
  const data = JSON.stringify(posts, null, 2);
  await writeFile(POSTS_FILE, data, 'utf-8');
}

async function findPostIndex(
  slug: string,
): Promise<{ posts: Post[]; index: number }> {
  const posts = await loadPosts();
  const index = posts.findIndex((p) => slugify(p.title) === slug);
  return { posts, index };
}

export async function addPost(post: Post): Promise<void> {
  const posts = await loadPosts();
  const slug = slugify(post.title);
  const exists = posts.some((p) => slugify(p.title) === slug);

  if (exists) {
    throw new Error(`Post with slug "${slug}" already exists`);
  }

  posts.push(post);
  await writePosts(posts);
}

export async function updatePost(
  slug: string,
  changes: Partial<Post>,
): Promise<void> {
  const { posts, index } = await findPostIndex(slug);
  const existing = posts[index];

  if (index === -1 || !existing) {
    throw new Error(`Post with slug "${slug}" not found`);
  }

  posts[index] = { ...existing, ...changes } as Post;
  await writePosts(posts);
}

export async function deletePost(slug: string): Promise<void> {
  const { posts, index } = await findPostIndex(slug);

  if (index === -1) {
    throw new Error(`Post with slug "${slug}" not found`);
  }

  posts.splice(index, 1);
  await writePosts(posts);
}

export async function getPostWithNeighbors(
  slug: string,
): Promise<PostWithNeighbors | undefined> {
  const rawPosts = await loadPosts();

  const posts = rawPosts
    .map((p) => ({ ...p, slug: slugify(p.title) }))
    .sort((a, b) => b.createdAt - a.createdAt);

  const index = posts.findIndex((p) => p.slug === slug);
  const post = posts[index];

  if (index === -1 || !post) return undefined;

  return {
    post,
    // Index increases going down the list (so index + 1 is the previous entry in list sequence)
    previousPost: index < posts.length - 1 ? (posts[index + 1] ?? null) : null,
    nextPost: index > 0 ? (posts[index - 1] ?? null) : null,
  };
}
