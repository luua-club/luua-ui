import { ParsedLocation, redirect } from '@tanstack/react-router'

import { LUUA_AUTH_INFO_KEY } from '@/core/config/constant'
import { AuthInfo } from '@/core/models/auth.model'
import {
  parseSafeAppRedirect,
  serializeLocationSearch,
} from '@/core/utils/safe-app-redirect.util'
import { syncExtCookie } from '@/shared/utils/extension-cookie.util'
import { getLocalStorageItem } from '@/shared/utils/localstorage.util'

export const AuthGuard = ({ location }: { location: ParsedLocation }) => {
  const authInfo = getLocalStorageItem<AuthInfo>(LUUA_AUTH_INFO_KEY)
  const isLoggedIn = !!authInfo?.access_token

  if (isLoggedIn) {
    syncExtCookie()
  }

  const path = location.pathname

  const searchParams = location.search as Record<string, unknown>
  const isExtensionLogin = searchParams.source === 'extension'

  if (!isLoggedIn && path !== '/login') {
    const redirectSearch = isExtensionLogin
      ? { source: 'extension', extensionId: searchParams.extensionId }
      : {
          redirect: encodeURIComponent(
            `${path}${serializeLocationSearch(searchParams)}`
          ),
        }
    throw redirect({ to: '/login', search: redirectSearch })
  }

  if (isLoggedIn && path === '/login' && !isExtensionLogin) {
    const redirectRaw =
      typeof searchParams.redirect === 'string'
        ? searchParams.redirect
        : undefined
    const target = parseSafeAppRedirect(redirectRaw)
    if (target) {
      throw redirect({ to: target.pathname, search: target.search })
    }
    throw redirect({ to: '/dashboard', search: {} })
  }

  if (isLoggedIn && path === '/') {
    throw redirect({ to: '/dashboard', search: {} })
  }

  return {}
}
