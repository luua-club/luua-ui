import { type AnyRoute, createRoute } from '@tanstack/react-router'

export default function getSettingsRoute(privateRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => privateRoute,
    path: '/settings',
  }).lazy(() => import('./settings').then(d => d.Route))
}
