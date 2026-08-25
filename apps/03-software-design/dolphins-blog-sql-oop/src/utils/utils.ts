import sanitizeHtml from 'sanitize-html';

export function getSlugParam(
  param: string | string[] | undefined,
): string | null {
  const slug = Array.isArray(param) ? param[0] : param;
  return slug && /^[a-z0-9-]+$/.test(slug) ? slug : null;
}

export function sanitizePostContent(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: [
      'p',
      'h1',
      'h2',
      'h3',
      'a',
      'ul',
      'ol',
      'li',
      'img',
      'strong',
      'em',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt'],
    },
  });
}

export function formatDate(unix: number): string {
  return new Date(unix * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
