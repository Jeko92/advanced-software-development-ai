import type { Post, PostWithAuthor } from '../entities/Post.ts';

export interface IPostRepository {
  loadPosts(): Promise<Post[]>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  addPost(post: Post): Promise<void>;
  updatePost(slug: string, changes: Partial<Post>): Promise<void>;
  deletePost(slug: string): Promise<void>;
  createBlogEntry(entry: Omit<Post, 'id' | 'slug'>): Promise<number>;
  updateBlogEntry(id: number, changes: Partial<Omit<Post, 'id' | 'slug'>>): Promise<void>;
  deleteBlogEntry(id: number): Promise<void>;
  loadPostsWithAuthors(): Promise<PostWithAuthor[]>;
}
