import { type AnyRoute, createRoute } from '@tanstack/react-router'

import Login from './login'

/**
 * Auth Route
 */
export default function getAuthRoute(rootRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: Login,
  })
}
