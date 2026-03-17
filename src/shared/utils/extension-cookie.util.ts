import { LUUA_AUTH_INFO_KEY } from '@/core/config/constant'
import { AuthInfo } from '@/core/models/auth.model'

import { getLocalStorageItem } from './localstorage.util'

/**
 * Write a `luua-ext-session` cookie so the Chrome extension can pick up
 * the current session without a separate login.
 *
 * Always writes the cookie when a token exists — even if org/project are
 * not yet available. The extension's useSession hook resolves missing
 * org/project via /user/profile while still in the loading state, so the
 * "Reconnect" banner never shows for valid tokens.
 *
 * @param override - Pass the AuthInfo object directly when the caller
 *   already has it (e.g. right after loadAuthData returns). If omitted
 *   the function reads from localStorage.
 */
export function syncExtCookie(override?: AuthInfo) {
  const authInfo = override ?? getLocalStorageItem<AuthInfo>(LUUA_AUTH_INFO_KEY)

  if (!authInfo?.access_token) {
    document.cookie = 'luua-ext-session=; path=/; max-age=0; SameSite=Lax'
    return
  }

  const payload = JSON.stringify({
    token: authInfo.access_token,
    email: authInfo.user?.email ?? '',
    orgId: authInfo.currentOrg?.id ?? null,
    projectId: authInfo.currentProject?.id ?? null,
  })
  document.cookie = `luua-ext-session=${encodeURIComponent(payload)}; path=/; max-age=86400; SameSite=Lax`
}

export function clearExtCookie() {
  document.cookie = 'luua-ext-session=; path=/; max-age=0; SameSite=Lax'
}
