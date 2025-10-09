import { ParsedLocation, redirect } from '@tanstack/react-router'

import { LUUA_USER_KEY } from '@/core/config/constant'
import { getLocalStorageItem } from '@/shared/utils/localstorage.util'

export const AuthGuard = ({ location }: { location: ParsedLocation }) => {
  const isLoggedIn = getLocalStorageItem(LUUA_USER_KEY) !== null

  const path = location.pathname

  // If user is not logged in and the current path is not login, redirect to login
  // Arises when user is not logged in and tries to access a protected route
  if (!isLoggedIn && path !== '/login') {
    throw redirect({ to: '/login' })
  }

  // If user is logged in and the current path is login, redirect to dashboard
  // Arises when user is logged in and tries to access the login page
  if (isLoggedIn && path === '/login') {
    throw redirect({ to: '/dashboard' })
  }

  // If user is logged in and the current path is root, redirect to dashboard
  // Arises when user is logged in and enter our normal url
  if (isLoggedIn && path === '/') {
    throw redirect({ to: '/dashboard' })
  }

  return {}
}
