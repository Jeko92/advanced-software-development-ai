import type { Request } from 'express';

export class AuthService {
  private readonly adminUser: string;
  private readonly adminPass: string;
  readonly cookieSecret: string; // AuthMiddleware/app.ts need this for cookieParser()

  constructor() {
    this.adminUser = process.env['ADMIN_USER'] || 'admin';
    this.adminPass = this.requireEnv('ADMIN_PASS');
    this.cookieSecret = this.requireEnv('COOKIE_SECRET');
  }

  private requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
      throw new Error(`${name} must be set (see .env.example)`);
    }
    return value;
  }

  /**
   * Shared credential check behind both requireAdminAny (HTML) and
   * requireAdminApi (JSON) — a valid signed session cookie or HTTP Basic
   * Auth.
   */
  isAuthenticated(req: Request): boolean {
    if (req.signedCookies && req.signedCookies['admin'] === 'true') {
      return true;
    }

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Basic ')) {
      const token = authHeader.split(' ')[1];
      const credentials = token
        ? Buffer.from(token, 'base64').toString('utf-8')
        : '';
      const [user, pass] = credentials.split(':');

      if (user === this.adminUser && pass === this.adminPass) {
        return true;
      }
    }

    return false;
  }

  verifyPassword(password: string): boolean {
    return password === this.adminPass;
  }
}
