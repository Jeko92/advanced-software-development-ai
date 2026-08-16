import type { Request, Response } from 'express';
import { formatDate } from '../../utils/utils.ts';
import { loadPosts } from '../../models/post.model.ts';
import { slugify, type Post } from '../../entities/Post.ts';

// Change this number to 2, 3, 4, or whatever size you want per page!
const PAGE_SIZE = Number(process.env['PAGE_SIZE']) || 2;

const homeController = async ( req: Request, res: Response ) => {
  const posts = await loadPosts();

  const authorFilter =
    typeof req.query['author'] === 'string' ? req.query['author'].trim() : '';
  const sort = req.query['sort'] === 'oldest' ? 'oldest' : 'newest';
  const page =
    typeof req.query['page'] === 'string' &&
    Number.isInteger(Number(req.query['page']))
      ? Math.max(1, Number(req.query['page']))
      : 1;

  const filteredPosts = authorFilter
    ? posts.filter(( post ) =>
      post.author.toLowerCase().includes(authorFilter.toLowerCase()),
    )
    : posts;

  const sortedPosts = [ ...filteredPosts ].sort(( a, b ) => {
    if ( sort === 'oldest' ) {
      return a.createdAt - b.createdAt;
    }
    return b.createdAt - a.createdAt;
  });

  const totalPages = Math.max(1, Math.ceil(sortedPosts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pagedPosts = sortedPosts.slice(start, start + PAGE_SIZE);

  const view = pagedPosts.map(( post: Post ) => ({
    ...post,
    slug: slugify(post.title),
    createdAt: formatDate(post.createdAt),
  }));

  res.render('public/home.njk', {
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
  });
};

export default homeController;
