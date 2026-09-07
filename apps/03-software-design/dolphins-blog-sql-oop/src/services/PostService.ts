import type { IPostRepository } from '../repositories/IPostRepository.ts';
import {
  slugify,
  type Post,
  type PostWithAuthor,
  type PostWithNeighbors,
} from '../entities/Post.ts';
import { sanitizePostContent, formatDate } from '../utils/utils.ts';

// Change this number to 2, 3, 4, or whatever size you want per page!
const PAGE_SIZE = Number(process.env['PAGE_SIZE']) || 2;

interface HomePagePost extends Omit<Post, 'createdAt'> {
  slug: string;
  createdAt: string;
}

interface HomePageControls {
  author: string;
  sort: 'newest' | 'oldest';
  page: number;
  totalPages: number;
  pageSize: number;
  hasPrev: boolean;
  hasNext: boolean;
}

interface HomePageResult {
  pageClass: string;
  posts: HomePagePost[];
  controls: HomePageControls;
}

interface PostStats {
  totalPosts: number;
  averageContentLength: number;
  authorCounts: Record<string, number>;
}

export class PostService {
  constructor(private readonly postRepository: IPostRepository) {}

  async getHomePagePosts(query: {
    author?: unknown;
    sort?: unknown;
    page?: unknown;
  }): Promise<HomePageResult> {
    const posts = await this.postRepository.loadPosts();

    const authorFilter =
      typeof query.author === 'string' ? query.author.trim() : '';
    const sort = query.sort === 'oldest' ? 'oldest' : 'newest';
    const page =
      typeof query.page === 'string' && Number.isInteger(Number(query.page))
        ? Math.max(1, Number(query.page))
        : 1;

    const filteredPosts = authorFilter
      ? posts.filter((post) =>
          post.author.toLowerCase().includes(authorFilter.toLowerCase()),
        )
      : posts;

    const sortedPosts = [...filteredPosts].sort((a, b) =>
      sort === 'oldest' ? a.createdAt - b.createdAt : b.createdAt - a.createdAt,
    );

    const totalPages = Math.max(1, Math.ceil(sortedPosts.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * PAGE_SIZE;
    const pagedPosts = sortedPosts.slice(start, start + PAGE_SIZE);

    const view: HomePagePost[] = pagedPosts.map((post) => ({
      ...post,
      slug: slugify(post.title),
      createdAt: formatDate(post.createdAt),
    }));

    return {
      pageClass: 'page-home',
      posts: view,
      controls: {
        author: authorFilter,
        sort,
        page: currentPage,
        totalPages,
        pageSize: PAGE_SIZE,
        hasPrev: currentPage > 1,
        hasNext: currentPage < totalPages,
      },
    };
  }

  async getPostWithNeighbors(
    slug: string,
  ): Promise<PostWithNeighbors | undefined> {
    const posts = await this.postRepository.loadPosts();
    const index = posts.findIndex((post) => post.slug === slug);

    if (index === -1) return undefined;

    const post = posts[index];
    if (!post) return undefined;

    return {
      post,
      previousPost:
        index < posts.length - 1 ? (posts[index + 1] ?? null) : null,
      nextPost: index > 0 ? (posts[index - 1] ?? null) : null,
    };
  }

  async getStats(): Promise<PostStats> {
    const posts = await this.postRepository.loadPosts();

    const totalPosts = posts.length;

    const authorCounts: Record<string, number> = {};
    let totalContentLength = 0;

    for (const post of posts) {
      authorCounts[post.author] = (authorCounts[post.author] || 0) + 1;
      totalContentLength += (post.content || '').length;
    }

    const averageContentLength =
      totalPosts > 0 ? Math.round(totalContentLength / totalPosts) : 0;

    return { totalPosts, averageContentLength, authorCounts };
  }

  async getRandomPost(): Promise<Post | undefined> {
    const posts = await this.postRepository.loadPosts();
    if (posts.length === 0) return undefined;

    const randomIndex = Math.floor(Math.random() * posts.length);
    return posts[randomIndex];
  }

  async getLatestPost(): Promise<Post | undefined> {
    const posts = await this.postRepository.loadPosts();
    if (posts.length === 0) return undefined;

    return [...posts].sort((a, b) => b.createdAt - a.createdAt)[0];
  }

  async getPostsWithAuthors(): Promise<PostWithAuthor[]> {
    return this.postRepository.loadPostsWithAuthors();
  }

  async loadPosts(): Promise<Post[]> {
    return this.postRepository.loadPosts();
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    return this.postRepository.getPostBySlug(slug);
  }

  async createPost(post: Post): Promise<void> {
    await this.postRepository.addPost({
      ...post,
      content: sanitizePostContent(post.content),
    });
  }

  async updatePost(slug: string, changes: Partial<Post>): Promise<void> {
    const sanitizedChanges: Partial<Post> = { ...changes };
    if (changes.content !== undefined) {
      sanitizedChanges.content = sanitizePostContent(changes.content);
    }

    await this.postRepository.updatePost(slug, sanitizedChanges);
  }

  async deletePost(slug: string): Promise<void> {
    await this.postRepository.deletePost(slug);
  }

  async createBlogEntry(entry: Omit<Post, 'id' | 'slug'>): Promise<number> {
    return this.postRepository.createBlogEntry({
      ...entry,
      content: sanitizePostContent(entry.content),
    });
  }

  async updateBlogEntry(
    id: number,
    changes: Partial<Omit<Post, 'id' | 'slug'>>,
  ): Promise<void> {
    const sanitizedChanges: Partial<Omit<Post, 'id' | 'slug'>> = {
      ...changes,
    };
    if (changes.content !== undefined) {
      sanitizedChanges.content = sanitizePostContent(changes.content);
    }

    await this.postRepository.updateBlogEntry(id, sanitizedChanges);
  }

  async deleteBlogEntry(id: number): Promise<void> {
    await this.postRepository.deleteBlogEntry(id);
  }
}
