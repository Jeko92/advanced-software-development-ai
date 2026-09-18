/**
 * Countdown formatting utilities
 * Formats time remaining until a deadline
 */

/**
 * Time units for countdown display
 */
export interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalSeconds: number
}

/**
 * Calculate time remaining until a deadline
 * @param deadline - The deadline date string or Date object
 * @returns CountdownTime object with days, hours, minutes, seconds
 */
export function getTimeRemaining(deadline: string | Date): CountdownTime {
  const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline
  const now = new Date()
  const totalSeconds = Math.max(0, Math.floor((deadlineDate.getTime() - now.getTime()) / 1000))

  const days = Math.floor(totalSeconds / (3600 * 24))
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return { days, hours, minutes, seconds, totalSeconds }
}

/**
 * Format a countdown as a string (e.g., "2d 5h 30m")
 * @param deadline - The deadline date string or Date object
 * @param showSeconds - Whether to show seconds
 * @returns Formatted countdown string
 */
export function formatCountdown(
  deadline: string | Date,
  showSeconds: boolean = false
): string {
  const { days, hours, minutes, seconds } = getTimeRemaining(deadline)

  if (days > 0) {
    if (showSeconds) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`
    }
    return `${days}d ${hours}h ${minutes}m`
  }

  if (hours > 0) {
    if (showSeconds) {
      return `${hours}h ${minutes}m ${seconds}s`
    }
    return `${hours}h ${minutes}m`
  }

  if (minutes > 0) {
    if (showSeconds) {
      return `${minutes}m ${seconds}s`
    }
    return `${minutes}m`
  }

  return showSeconds ? `${seconds}s` : '0m'
}

/**
 * Format a countdown as a long string (e.g., "2 days, 5 hours, 30 minutes")
 * @param deadline - The deadline date string or Date object
 * @param showSeconds - Whether to show seconds
 * @returns Formatted long countdown string
 */
export function formatCountdownLong(
  deadline: string | Date,
  showSeconds: boolean = false
): string {
  const { days, hours, minutes, seconds } = getTimeRemaining(deadline)
  const parts: string[] = []

  if (days > 0) {
    parts.push(`${days} day${days !== 1 ? 's' : ''}`)
  }
  if (hours > 0) {
    parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`)
  }
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`)
  }
  if (showSeconds && seconds > 0) {
    parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`)
  }

  return parts.length > 0 ? parts.join(', ') : '0 minutes'
}

/**
 * Format a countdown for display in the UI
 * Short format for compact display
 * @param deadline - The deadline date string or Date object
 * @returns Formatted countdown string
 */
export function displayCountdown(deadline: string | Date): string {
  const { days, hours, minutes } = getTimeRemaining(deadline)

  if (days > 0) {
    return `${days}d ${hours}h`
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  if (minutes > 0) {
    return `${minutes}m`
  }
  return 'Ended'
}

/**
 * Check if a deadline has passed
 * @param deadline - The deadline date string or Date object
 * @returns True if the deadline has passed
 */
export function isDeadlinePassed(deadline: string | Date): boolean {
  const { totalSeconds } = getTimeRemaining(deadline)
  return totalSeconds <= 0
}

/**
 * Get a descriptive string for time remaining
 * @param deadline - The deadline date string or Date object
 * @returns Descriptive string like "Ending soon" or "2 days left"
 */
export function getCountdownDescription(deadline: string | Date): string {
  const { days, hours, totalSeconds } = getTimeRemaining(deadline)

  if (totalSeconds <= 0) {
    return 'Ended'
  }

  if (days === 0 && hours === 0) {
    return 'Ending soon'
  }

  if (days === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''} left`
  }

  if (days === 1) {
    return 'Ending tomorrow'
  }

  if (days < 7) {
    return `${days} day${days !== 1 ? 's' : ''} left`
  }

  return displayCountdown(deadline)
}

/**
 * Format a countdown with a specific format template
 * @param deadline - The deadline date string or Date object
 * @param template - Format template with placeholders (e.g., "{d}d {h}h {m}m")
 * @returns Formatted countdown string
 */
export function formatCountdownTemplate(
  deadline: string | Date,
  template: string = '{d}d {h}h {m}m'
): string {
  const { days, hours, minutes, seconds } = getTimeRemaining(deadline)

  return template
    .replace('{d}', days.toString())
    .replace('{h}', hours.toString())
    .replace('{m}', minutes.toString())
    .replace('{s}', seconds.toString())
}

/**
 * Get the percentage of time remaining
 * @param deadline - The deadline date string or Date object
 * @param startDate - Optional start date (defaults to now - totalSeconds)
 * @returns Percentage of time remaining (0-100)
 */
export function getTimeRemainingPercentage(
  deadline: string | Date,
  startDate?: string | Date
): number {
  const { totalSeconds } = getTimeRemaining(deadline)
  
  if (totalSeconds <= 0) {
    return 0
  }

  const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline
  const start = startDate ? (typeof startDate === 'string' ? new Date(startDate) : startDate) : new Date(Date.now() - totalSeconds * 1000)
  const totalDuration = (deadlineDate.getTime() - start.getTime()) / 1000
  
  return Math.round((totalSeconds / totalDuration) * 100)
}
