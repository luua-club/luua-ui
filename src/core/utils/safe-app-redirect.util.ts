/**
 * Validates post-login redirect targets (relative app URLs only; blocks open redirects).
 */

export type SafeAppRedirectTarget = {
  pathname: string
  search: Record<string, string | boolean | number>
}

const PATH_SEGMENT = /^\/[a-zA-Z0-9/_-]*$/

export function parseSafeAppRedirect(
  encoded: string | null | undefined
): SafeAppRedirectTarget | null {
  if (encoded == null || encoded === '') return null

  let rel: string
  try {
    rel = decodeURIComponent(encoded)
  } catch {
    return null
  }

  if (!rel.startsWith('/') || rel.startsWith('//')) return null

  const q = rel.indexOf('?')
  const pathPart = q >= 0 ? rel.slice(0, q) : rel
  const queryPart = q >= 0 ? rel.slice(q + 1) : ''

  if (pathPart.includes('..') || !PATH_SEGMENT.test(pathPart)) return null

  const search: Record<string, string | boolean | number> = {}
  if (queryPart) {
    const params = new URLSearchParams(queryPart)
    params.forEach((value, key) => {
      if (value === 'true') search[key] = true
      else if (value === 'false') search[key] = false
      else if (/^-?\d+$/.test(value)) search[key] = Number(value)
      else search[key] = value
    })
  }

  return { pathname: pathPart, search }
}

/**
 * Origins the post-login `returnTo` is allowed to point at. This is the Luua
 * landing site (where pricing now lives), so a checkout started on the landing
 * can send the guest to login and bounce them back to resume. An allowlist of
 * exact origins keeps this from becoming an open redirect.
 */
const ALLOWED_RETURN_ORIGINS: string[] = (() => {
  const origins = new Set<string>(['https://luua.club'])

  const fromEnv = import.meta.env.VITE_LUUA_LANDING_URL
  if (typeof fromEnv === 'string' && fromEnv) {
    try {
      origins.add(new URL(fromEnv).origin)
    } catch {
      // Ignore a malformed override.
    }
  }

  // Local dev: the landing runs on :3000 (the app on :3001).
  if (import.meta.env.DEV) origins.add('http://localhost:3000')

  return Array.from(origins)
})()

/**
 * Validates an absolute post-login `returnTo` URL against
 * {@link ALLOWED_RETURN_ORIGINS}. Returns the normalized URL string when the
 * origin is allowlisted, otherwise `null` (blocking open redirects).
 */
export function parseExternalReturnTo(
  encoded: string | null | undefined
): string | null {
  if (encoded == null || encoded === '') return null

  let decoded: string
  try {
    decoded = decodeURIComponent(encoded)
  } catch {
    return null
  }

  let url: URL
  try {
    url = new URL(decoded)
  } catch {
    return null
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
  if (!ALLOWED_RETURN_ORIGINS.includes(url.origin)) return null

  return url.toString()
}

export function serializeLocationSearch(
  search: Record<string, unknown>
): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(search)) {
    if (value === undefined || value === null) continue
    params.set(key, String(value))
  }
  const q = params.toString()
  return q ? `?${q}` : ''
}
