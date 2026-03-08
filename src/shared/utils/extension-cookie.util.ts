import { LUUA_AUTH_INFO_KEY } from '@/core/config/constant'
import { AuthInfo } from '@/core/models/auth.model'

import { getLocalStorageItem } from './localstorage.util'

export function syncExtCookie() {
  const authInfo = getLocalStorageItem<AuthInfo>(LUUA_AUTH_INFO_KEY)

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
