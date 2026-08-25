import type { Request, Response } from 'express';

export class ContactController {
  index = ( _req: Request, res: Response ) => {
    res.render('public/contact.njk');
  }
}
