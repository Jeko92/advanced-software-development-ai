import type { BlogEntry } from '../../models/blogModel.ts';

type AllBlogsResponse = {
  info: {
    totalBlogs: number;
    page: number;
    totalPages: number;
  };
  result: BlogEntry[];
};

export default function allBlogsResponse(blogs: BlogEntry[]): AllBlogsResponse {
  return {
    info: {
      totalBlogs: blogs.length,
      page: 1,
      totalPages: 1,
    },
    result: blogs,
  };
}
