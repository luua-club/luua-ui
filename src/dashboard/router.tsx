import { type AnyRoute, createRoute } from '@tanstack/react-router'

/**
 * Main Dashboard route
 */
export default function getDashboardRoute(privateRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => privateRoute,
    path: '/dashboard',
  }).lazy(() => import('./dashboard').then(d => d.Route))
}
