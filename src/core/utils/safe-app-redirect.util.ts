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
