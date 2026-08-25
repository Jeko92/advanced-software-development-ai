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
