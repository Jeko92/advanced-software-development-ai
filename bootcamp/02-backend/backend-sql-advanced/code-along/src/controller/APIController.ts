import type { Request, Response } from 'express';
import * as blogModel from '../models/blogModel.ts';
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

    const blogs = await blogModel.searchBlogEntries({
      author: typeof author === 'string' ? author : undefined,
      search: typeof search === 'string' ? search : undefined,
      direction: direction === 'ASC' ? 'ASC' : 'DESC',
      limit: typeof limit === 'string' ? Number(limit) : undefined,
    });

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

export async function createBlog(req: Request, res: Response) {
  try {
    const newId = await blogModel.createBlogEntry(req.body);
    res.status(201).json({ id: newId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create blog entry' });
  }
}

export async function updateBlog(req: Request<{ id: string }>, res: Response) {
  try {
    await blogModel.updateBlogEntry(Number(req.params.id), req.body);
    res.status(200).json({ message: 'Blog entry updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update blog entry' });
  }
}

export async function deleteBlog(req: Request<{ id: string }>, res: Response) {
  try {
    await blogModel.deleteBlogEntry(Number(req.params.id));
    res.status(200).json({ message: 'Blog entry deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete blog entry' });
  }
}
