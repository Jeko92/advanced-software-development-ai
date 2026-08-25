import type { RequestHandler } from 'express';
import multer from 'multer';
import path from 'node:path';

const uploadDir = path.join(process.cwd(), 'src/assets/img/post-bg');

const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp']);
const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
]);

/**
 * Thrown by fileFilter for a rejected (not multer.MulterError) upload — the
 * client's fault, not a server error, so ErrorHandlerMiddleware maps it to a
 * 400 instead of Express's default 500.
 */
export class UploadValidationError extends Error {}

export class UploadMiddleware {
  private readonly multerInstance: multer.Multer;

  constructor() {
    const storage = multer.diskStorage({
      destination: (_req, _file, cb) => {
        cb(null, uploadDir);
      },
      filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

        cb(null, `post-image-${uniqueSuffix}${ext}`);
      },
    });

    this.multerInstance = multer({
      storage,
      fileFilter: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const isAllowed =
          ALLOWED_MIME_TYPES.has(file.mimetype) && ALLOWED_EXTENSIONS.has(ext);

        if (!isAllowed) {
          cb(
            new UploadValidationError(
              'Only PNG, JPEG, GIF, or WEBP images are allowed.',
            ),
          );
          return;
        }

        cb(null, true);
      },
    });
  }

  single(fieldName: string): RequestHandler {
    return this.multerInstance.single(fieldName);
  }
}
