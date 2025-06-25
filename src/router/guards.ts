import { ParsedLocation, redirect } from '@tanstack/react-router'

export const AuthGuard = ({ location }: { location: ParsedLocation }) => {
  // TODO: Add real auth logic here
  const isLoggedIn = true
  const path = location.pathname

  if (!isLoggedIn && path !== '/login') {
    throw redirect({ to: '/login' })
  }

  if (isLoggedIn && path === '/login') {
    throw redirect({ to: '/dashboard' })
  }

  if (isLoggedIn && path === '/') {
    throw redirect({ to: '/dashboard' })
  }

  return {}
}
