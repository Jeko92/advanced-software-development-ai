import type { Request, Response } from 'express';
import * as blogModel from '../models/blogModel.ts';
import type { BlogEntrySearchFilters } from '../models/blogModel.ts';
import allBlogsResponse from '../views/api/allBlogsResponse.ts';

export async function getAllBlogs(_req: Request, res: Response) {
  try {
    const blogs = await blogModel.getAllBlogEntries();
    res.status(200).json(allBlogsResponse(blogs));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch blog entries' });
  }
}

export async function searchBlogs(req: Request, res: Response) {
  try {
    const { author, search, direction, limit } = req.query;

    const filters: BlogEntrySearchFilters = {
      direction: direction === 'ASC' ? 'ASC' : 'DESC',
    };
    if (typeof author === 'string') filters.author = author;
    if (typeof search === 'string') filters.search = search;
    if (typeof limit === 'string') filters.limit = Number(limit);

    const blogs = await blogModel.searchBlogEntries(filters);

    res.status(200).json(allBlogsResponse(blogs));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search blog entries' });
  }
}

export async function getBlogById(req: Request<{ id: string }>, res: Response) {
  try {
    const blog = await blogModel.getBlogEntryById(Number(req.params.id));

    if (!blog) {
      res.status(404).json({ error: 'Blog entry not found' });
      return;
    }

    res.status(200).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch blog entry' });
  }
}
