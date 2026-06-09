import { type AuthInfo } from '@/core/models/auth.model'

/**
 * Extension session-cookie sync — DORMANT under cookie-based web auth.
 *
 * The web app used to write a `luua-ext-session` cookie containing the JWT so
 * the Chrome extension could pick up the session. With cookie auth the session
 * lives in an httpOnly cookie the page can't read, so there is no token to
 * sync — this is a no-op kept so existing call sites compile.
 *
 * TODO: extension handoff pending cookie migration (give the extension its own
 * cookie/refresh flow, e.g. via the `/extension/*` endpoints).
 *
 * @param _override - accepted for call-site compatibility; ignored.
 */
export function syncExtCookie(_override?: AuthInfo): void {
  // no-op (see above)
}

export function clearExtCookie() {
  document.cookie = 'luua-ext-session=; path=/; max-age=0; SameSite=Lax'
}
