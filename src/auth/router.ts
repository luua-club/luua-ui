import { type AnyRoute, createRoute } from '@tanstack/react-router'

/**
 * Auth Route
 */
export default function getAuthRoute(rootRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
  }).lazy(() => import('./login').then(d => d.Route))
}
