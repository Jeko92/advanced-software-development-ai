import type { Request, Response } from 'express';
import type { AuthService } from '../../services/AuthService.ts';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  getLogin = (req: Request, res: Response): void => {
    if (req.signedCookies && req.signedCookies['admin'] === 'true') {
      res.redirect('/admin');
      return;
    }
    res.render('admin/login.njk');
  };

  postLogin = (req: Request, res: Response): void => {
    const { password } = req.body || {};

    if (this.authService.verifyPassword(password)) {
      res.cookie('admin', 'true', {
        signed: true,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env['NODE_ENV'] === 'production',
      });
      res.redirect('/admin');
    } else {
      res.status(401).render('admin/login.njk', { error: 'Invalid password' });
    }
  };

  getLogout = (_req: Request, res: Response): void => {
    res.clearCookie('admin');
    res.redirect('/login');
  };
}
