import { ParsedLocation, redirect } from '@tanstack/react-router'

import { isAuthenticated } from '@/core/utils/auth-data.util'
import {
  parseSafeAppRedirect,
  serializeLocationSearch,
} from '@/core/utils/safe-app-redirect.util'
import { syncExtCookie } from '@/shared/utils/extension-cookie.util'

export const AuthGuard = ({ location }: { location: ParsedLocation }) => {
  const isLoggedIn = isAuthenticated()

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
