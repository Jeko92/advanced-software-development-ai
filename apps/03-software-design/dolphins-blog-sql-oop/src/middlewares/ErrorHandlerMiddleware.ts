import type { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { UploadValidationError } from './UploadMiddleware.ts';

/**
 * Central error handler. Must be registered last, after every router — see
 * app.ts. Anything a middleware/controller passes to next(err), including
 * the errors Multer's fileFilter/limits raise, ends up here instead of
 * Express's default handler (which leaks a raw stack trace with a 500).
 */
export class ErrorHandlerMiddleware {
  handle = (
    err: unknown,
    _req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    if (res.headersSent) {
      next(err);
      return;
    }

    const isClientUploadError =
      err instanceof multer.MulterError || err instanceof UploadValidationError;

    if (isClientUploadError) {
      res.status(400).render('public/400.njk', {
        title: 'Bad Request',
        message: (err as Error).message,
      });
      return;
    }

    console.error('Unhandled error:', err);
    res.status(500).render('public/500.njk', { title: 'Server Error' });
  };
}
