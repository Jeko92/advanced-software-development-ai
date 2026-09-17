/**
 * Price formatting utilities
 * Supports various currency formats with locale-aware formatting
 */

const DEFAULT_CURRENCY = 'EUR'
const DEFAULT_LOCALE = 'en-US'

// Currency symbols for display
const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CHF: 'CHF',
  JPY: '¥',
  CAD: 'CA$',
  AUD: 'AU$',
}

/**
 * Format a price as currency
 * @param amount - The amount to format
 * @param currency - Currency code (default: EUR)
 * @param locale - Locale for formatting (default: en-US)
 * @returns Formatted price string
 */
export function formatPrice(
  amount: number,
  currency: string = DEFAULT_CURRENCY,
  locale: string = DEFAULT_LOCALE
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    // Fallback for unsupported locales/currencies
    const symbol = currencySymbols[currency] || currency
    return `${symbol} ${formatNumber(amount)}`
  }
}

/**
 * Format a price with compact notation (e.g., $1.2M, $500K)
 * @param amount - The amount to format
 * @param currency - Currency code (default: EUR)
 * @param locale - Locale for formatting (default: en-US)
 * @returns Formatted compact price string
 */
export function formatPriceCompact(
  amount: number,
  currency: string = DEFAULT_CURRENCY,
  locale: string = DEFAULT_LOCALE
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      notation: 'compact',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    // Fallback
    const symbol = currencySymbols[currency] || currency
    if (amount >= 1000000) {
      return `${symbol} ${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `${symbol} ${(amount / 1000).toFixed(0)}K`
    }
    return formatPrice(amount, currency, locale)
  }
}

/**
 * Format a number with thousands separators
 * @param num - The number to format
 * @param locale - Locale for formatting (default: en-US)
 * @returns Formatted number string
 */
export function formatNumber(num: number, locale: string = DEFAULT_LOCALE): string {
  try {
    return new Intl.NumberFormat(locale).format(num)
  } catch {
    return num.toLocaleString()
  }
}

/**
 * Format a price range (e.g., "$10,000 - $15,000")
 * @param min - Minimum price
 * @param max - Maximum price
 * @param currency - Currency code
 * @param locale - Locale for formatting
 * @returns Formatted price range string
 */
export function formatPriceRange(
  min: number,
  max: number,
  currency: string = DEFAULT_CURRENCY,
  locale: string = DEFAULT_LOCALE
): string {
  const formattedMin = formatPrice(min, currency, locale)
  const formattedMax = formatPrice(max, currency, locale)
  return `${formattedMin} - ${formattedMax}`
}

/**
 * Format a price difference with sign (e.g., "+$500", "-$200")
 * @param amount - The amount (positive or negative)
 * @param currency - Currency code
 * @param locale - Locale for formatting
 * @returns Formatted price difference string
 */
export function formatPriceDifference(
  amount: number,
  currency: string = DEFAULT_CURRENCY,
  locale: string = DEFAULT_LOCALE
): string {
  const sign = amount >= 0 ? '+' : ''
  const absAmount = Math.abs(amount)
  const formatted = formatPrice(absAmount, currency, locale)
  return `${sign}${formatted}`
}

/**
 * Format a price without currency symbol (just the number)
 * @param amount - The amount to format
 * @returns Formatted number string
 */
export function formatPriceWithoutSymbol(amount: number): string {
  return formatNumber(Math.round(amount))
}

/**
 * Get currency symbol for a given currency code
 * @param currency - Currency code
 * @returns Currency symbol or the code itself
 */
export function getCurrencySymbol(currency: string): string {
  return currencySymbols[currency] || currency
}

/**
 * Format a price for display in the UI
 * Uses the application's default currency (EUR)
 * @param amount - The amount to format
 * @returns Formatted price string
 */
export function displayPrice(amount: number): string {
  return formatPrice(amount, DEFAULT_CURRENCY)
}

/**
 * Format a price as a plain number (no currency symbol)
 * @param amount - The amount to format
 * @returns Plain number string with separators
 */
export function displayPriceNumber(amount: number): string {
  return formatNumber(Math.round(amount))
}
