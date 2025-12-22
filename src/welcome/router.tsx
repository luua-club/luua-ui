import { type AnyRoute, createRoute } from '@tanstack/react-router'

/**
 * Welcome route
 */
export default function getWelcomeRoute(privateRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => privateRoute,
    path: '/welcome',
  }).lazy(() => import('./welcome').then(d => d.Route))
}
