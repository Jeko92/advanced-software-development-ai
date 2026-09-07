import type { BlogPosting } from '../../models/blogModel.ts';

type AllBlogsResponse = {
  info: {
    totalBlogs: number;
    page: number;
    totalPages: number;
  };
  result: BlogPosting[];
};

export default function allBlogsResponse(
  blogs: BlogPosting[],
): AllBlogsResponse {
  return {
    info: {
      totalBlogs: blogs.length,
      page: 1,
      totalPages: 1,
    },
    result: blogs,
  };
}
