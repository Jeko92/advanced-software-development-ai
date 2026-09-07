import { Router } from 'express';
import adminRoute from './admin.route.ts';
import { requireAdminAny, ADMIN_PASS } from '../../middlewares/auth.ts';

const adminRoutes: Router = Router();

adminRoutes.get('/login', (req, res) => {
  if (req.signedCookies && req.signedCookies['admin'] === 'true') {
    res.redirect('/admin');
    return;
  }
  res.render('admin/login.njk');
});

adminRoutes.post('/login', (req, res) => {
  const { password } = req.body || {};

  if (password === ADMIN_PASS) {
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
});

adminRoutes.get('/logout', (_req, res) => {
  res.clearCookie('admin');
  res.redirect('/login');
});

adminRoutes.use('/admin', requireAdminAny, adminRoute);

export default adminRoutes;
