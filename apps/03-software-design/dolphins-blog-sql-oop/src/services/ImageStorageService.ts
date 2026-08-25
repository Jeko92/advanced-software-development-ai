import fs from 'node:fs/promises';
import path from 'node:path';

const UPLOAD_DIR = path.join(process.cwd(), 'src/assets/img/post-bg');

export class ImageStorageService {
  /**
   * Safely removes an image file from the post-bg directory.
   *
   * `filename` ultimately comes from the `posting.image` column, which the
   * JSON API (ApiPostController) can also write to — so it isn't guaranteed
   * to be a bare filename. Strip any directory components and re-confirm the
   * resolved path still lives inside UPLOAD_DIR before deleting anything, so
   * a value like `../../../../etc/passwd` can't unlink outside the upload
   * directory. (Consolidated from utils/file.utils.ts#deletePostImage and
   * AdminPostController#removeImageFromDisk — kept the path-traversal guard
   * from the latter rather than the former's simpler, unguarded version.)
   */
  async deleteImage(filename?: string): Promise<void> {
    if (!filename) return;

    const safeName = path.basename(filename);
    const filePath = path.resolve(UPLOAD_DIR, safeName);
    const resolvedUploadDir = path.resolve(UPLOAD_DIR) + path.sep;

    if (!filePath.startsWith(resolvedUploadDir)) {
      console.error(`Refused to delete image outside upload dir: ${filename}`);
      return;
    }

    try {
      await fs.unlink(filePath);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.error(`Failed to delete image file (${filename}):`, err);
      }
    }
  }
}
