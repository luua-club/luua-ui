import { type AnyRoute, createRoute } from '@tanstack/react-router'

export default function getAnalyticsRoute(privateRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => privateRoute,
    path: '/analytics',
  }).lazy(() => import('./analytics').then(d => d.Route))
}
