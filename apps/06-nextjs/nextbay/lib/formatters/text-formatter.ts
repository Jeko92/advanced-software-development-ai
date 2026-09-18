/**
 * Text formatting utilities
 * Provides consistent text formatting throughout the application
 */

/**
 * Truncate text to a maximum length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  return `${text.slice(0, maxLength - 3)}...`
}

/**
 * Capitalize the first letter of a string
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export function capitalize(text: string): string {
  if (text.length === 0) return text
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Capitalize each word in a string
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export function capitalizeWords(text: string): string {
  return text.split(' ').map(capitalize).join(' ')
}

/**
 * Convert text to title case (capitalize first letter of each word, lowercase rest)
 * @param text - Text to convert
 * @returns Title case text
 */
export function toTitleCase(text: string): string {
  return text
    .split(' ')
    .map((word) => {
      if (word.length === 0) return word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}

/**
 * Convert text to sentence case (capitalize first letter, lowercase rest)
 * @param text - Text to convert
 * @returns Sentence case text
 */
export function toSentenceCase(text: string): string {
  if (text.length === 0) return text
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Generate initials from a name
 * @param name - Name to generate initials from
 * @param maxInitials - Maximum number of initials to return
 * @returns Initials string
 */
export function getInitials(name: string, maxInitials: number = 2): string {
  return name
    .split(' ')
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, maxInitials)
    .join('')
}

/**
 * Slugify text (convert to URL-friendly slug)
 * @param text - Text to slugify
 * @returns Slugified text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Sanitize HTML to prevent XSS
 * @param html - HTML to sanitize
 * @returns Sanitized HTML
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Strip HTML tags from text
 * @param html - HTML to strip tags from
 * @returns Plain text
 */
export function stripHtml(html: string): string {
  // Create a temporary div element to strip HTML
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}

/**
 * Format a number as an ordinal (1st, 2nd, 3rd, 4th, etc.)
 * @param num - Number to format
 * @returns Ordinal string
 */
export function formatOrdinal(num: number): string {
  const j = num % 10
  const k = num % 100

  if (j === 1 && k !== 11) {
    return `${num}st`
  }
  if (j === 2 && k !== 12) {
    return `${num}nd`
  }
  if (j === 3 && k !== 13) {
    return `${num}rd`
  }
  return `${num}th`
}

/**
 * Format a plural word based on count
 * @param count - The count
 * @param singular - Singular form of the word
 * @param plural - Plural form of the word (optional, defaults to singular + 's')
 * @returns Correctly pluralized word
 */
export function formatPlural(
  count: number,
  singular: string,
  plural?: string
): string {
  const p = plural || `${singular}s`
  return count === 1 ? singular : p
}

/**
 * Count words in text
 * @param text - Text to count words in
 * @returns Word count
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter((word) => word.length > 0).length
}

/**
 * Count characters in text (excluding whitespace)
 * @param text - Text to count characters in
 * @returns Character count
 */
export function countCharacters(text: string): number {
  return text.replace(/\s/g, '').length
}

/**
 * Check if text is empty or whitespace only
 * @param text - Text to check
 * @returns True if empty or whitespace
 */
export function isEmpty(text?: string): boolean {
  return !text || text.trim().length === 0
}

/**
 * Check if text is a valid email address
 * @param email - Email to validate
 * @returns True if valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i
  return emailRegex.test(email)
}

/**
 * Generate a random string of a given length
 * @param length - Length of the random string
 * @returns Random string
 */
export function randomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
