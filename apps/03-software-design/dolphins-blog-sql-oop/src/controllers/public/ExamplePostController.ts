import type { Request, Response } from 'express';

export class ExamplePostController {
  index = ( _req: Request, res: Response ) => {
    res.render('public/post-example.njk', {
      pageClass: 'page-example-post',
    });
  }
}
