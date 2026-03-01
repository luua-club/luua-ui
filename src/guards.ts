import { ParsedLocation, redirect } from '@tanstack/react-router'

import { LUUA_AUTH_INFO_KEY } from '@/core/config/constant'
import { AuthInfo } from '@/core/models/auth.model'
import { getLocalStorageItem } from '@/shared/utils/localstorage.util'

export const AuthGuard = ({ location }: { location: ParsedLocation }) => {
  const authInfo = getLocalStorageItem<AuthInfo>(LUUA_AUTH_INFO_KEY)
  const isLoggedIn = !!authInfo?.access_token

  const path = location.pathname

  // Check if this is an extension login request
  const searchParams = location.search as Record<string, unknown>
  const isExtensionLogin = searchParams.source === 'extension'

  // If user is not logged in and the current path is not login, redirect to login
  // Arises when user is not logged in and tries to access a protected route
  if (!isLoggedIn && path !== '/login') {
    // Preserve extension login context if present
    const redirectSearch = isExtensionLogin
      ? { source: 'extension', extensionId: searchParams.extensionId }
      : {}
    throw redirect({ to: '/login', search: redirectSearch })
  }

  // If user is logged in and the current path is login, redirect to dashboard
  // UNLESS it's an extension login request (allow extension login flow)
  if (isLoggedIn && path === '/login' && !isExtensionLogin) {
    throw redirect({ to: '/dashboard' })
  }

  // If user is logged in and the current path is root, redirect to dashboard
  // Arises when user is logged in and enters our normal url
  if (isLoggedIn && path === '/') {
    throw redirect({ to: '/dashboard' })
  }

  return {}
}
