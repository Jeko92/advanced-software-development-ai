import type { Request, Response } from 'express';
import type { PostService } from '../../services/PostService.ts';

export class HomeController {
  constructor(private readonly postService: PostService) {}

  index = async (req: Request, res: Response): Promise<void> => {
    const result = await this.postService.getHomePagePosts(req.query);
    res.render('public/home.njk', result);
  };
}
