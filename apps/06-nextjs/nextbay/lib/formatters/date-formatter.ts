/**
 * Date formatting utilities
 * Provides consistent date formatting throughout the application
 */

const DEFAULT_LOCALE = 'en-US'

// Month names for display
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

/**
 * Format a date as a full date string (e.g., "January 15, 2024")
 * @param date - Date string or Date object
 * @param locale - Locale for formatting
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date,
  locale: string = DEFAULT_LOCALE
): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateObj)
  } catch {
    return formatDateFallback(date)
  }
}

/**
 * Format a date as a short date string (e.g., "Jan 15, 2024")
 * @param date - Date string or Date object
 * @param locale - Locale for formatting
 * @returns Formatted short date string
 */
export function formatDateShort(
  date: string | Date,
  locale: string = DEFAULT_LOCALE
): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(dateObj)
  } catch {
    return formatDateFallback(date, true)
  }
}

/**
 * Format a date as a date-time string (e.g., "January 15, 2024 at 3:30 PM")
 * @param date - Date string or Date object
 * @param locale - Locale for formatting
 * @returns Formatted date-time string
 */
export function formatDateTime(
  date: string | Date,
  locale: string = DEFAULT_LOCALE
): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(dateObj)
  } catch {
    return `${formatDateFallback(date)} at ${formatTimeFallback(date)}`
  }
}

/**
 * Format a date as a relative time string (e.g., "2 hours ago", "3 days ago")
 * @param date - Date string or Date object
 * @param locale - Locale for formatting
 * @returns Formatted relative time string
 */
export function formatRelativeTime(
  date: string | Date,
  locale: string = DEFAULT_LOCALE
): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
    }

    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`
    }

    const diffInYears = Math.floor(diffInMonths / 12)
    return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`
  } catch {
    return formatDateFallback(date)
  }
}

/**
 * Format a date as a time only string (e.g., "3:30 PM")
 * @param date - Date string or Date object
 * @param locale - Locale for formatting
 * @returns Formatted time string
 */
export function formatTime(
  date: string | Date,
  locale: string = DEFAULT_LOCALE
): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(dateObj)
  } catch {
    return formatTimeFallback(date)
  }
}

/**
 * Format a date as a machine-readable string (ISO format)
 * @param date - Date string or Date object
 * @returns ISO formatted date string
 */
export function formatISO(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toISOString()
}

/**
 * Format a date for display in the UI
 * Uses a medium-length format that's readable but not too verbose
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export function displayDate(date: string | Date): string {
  return formatDateShort(date)
}

/**
 * Format a date as "Month Day" (e.g., "January 15")
 * @param date - Date string or Date object
 * @returns Formatted month-day string
 */
export function formatMonthDay(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const month = MONTH_NAMES[dateObj.getMonth()]
  const day = dateObj.getDate()
  return `${month} ${day}`
}

/**
 * Check if a date is in the past
 * @param date - Date string or Date object
 * @returns True if the date is in the past
 */
export function isPast(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj < new Date()
}

/**
 * Check if a date is today
 * @param date - Date string or Date object
 * @returns True if the date is today
 */
export function isToday(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  )
}

/**
 * Check if a date is in the future
 * @param date - Date string or Date object
 * @returns True if the date is in the future
 */
export function isFuture(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj > new Date()
}

/**
 * Fallback date formatter when Intl fails
 */
function formatDateFallback(date: string | Date, short: boolean = false): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const month = short ? MONTH_NAMES[dateObj.getMonth()].slice(0, 3) : MONTH_NAMES[dateObj.getMonth()]
  const day = dateObj.getDate()
  const year = dateObj.getFullYear()
  return `${month} ${day}, ${year}`
}

/**
 * Fallback time formatter when Intl fails
 */
function formatTimeFallback(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  let hours = dateObj.getHours()
  const minutes = dateObj.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12
  return `${hours}:${minutes} ${ampm}`
}
