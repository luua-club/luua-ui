import { type AnyRoute, createRoute } from '@tanstack/react-router'

import { parseLoginSearch } from './login-search'

/**
 * Auth Route
 */
export default function getAuthRoute(rootRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    validateSearch: parseLoginSearch,
  }).lazy(() => import('./login').then(d => d.Route))
}
