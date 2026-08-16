import type { Request, Response } from 'express';

export class AboutController {
  index = ( _req: Request, res: Response ) => {
    res.render('public/about.njk');
  };
}
