import type { Request, Response, NextFunction } from 'express';
import type { AuthService } from '../services/AuthService.ts';

export class AuthMiddleware {
  constructor(private readonly authService: AuthService) {}

  /** For the HTML admin routes — redirects to the login page on failure. */
  requireAdminAny = (req: Request, res: Response, next: NextFunction): void => {
    if (this.authService.isAuthenticated(req)) {
      next();
      return;
    }

    res.redirect('/login');
  };

  /**
   * For the JSON API's mutating routes — a redirect would hand a JSON client
   * an HTML login page, so this returns 401 JSON on failure instead while
   * enforcing the exact same credential check as requireAdminAny.
   */
  requireAdminApi = (req: Request, res: Response, next: NextFunction): void => {
    if (this.authService.isAuthenticated(req)) {
      next();
      return;
    }

    res.status(401).json({ error: 'Authentication required' });
  };
}
