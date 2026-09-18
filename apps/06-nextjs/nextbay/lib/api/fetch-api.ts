import { cookies } from 'next/headers'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function parseErrorMessage(body: unknown): string | undefined {
  if (body && typeof body === 'object' && 'message' in body) {
    const message = (body as { message: unknown }).message
    if (Array.isArray(message)) return message.join(', ')
    if (typeof message === 'string') return message
  }
  return undefined
}

export async function fetchAPI<T>(path: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = process.env.DARKBAY_API_URL
  if (!baseUrl) {
    throw new Error('DARKBAY_API_URL is not configured')
  }

  const token = (await cookies()).get('darkbay_token')?.value
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
    cache: 'no-store',
  })

  if (response.status === 204) {
    return undefined as T
  }

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(response.status, parseErrorMessage(body) ?? 'Something went wrong. Please try again.')
  }

  return body as T
}
