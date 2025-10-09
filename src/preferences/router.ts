import { type AnyRoute, createRoute } from '@tanstack/react-router'

export default function getPreferencesRoute(privateRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => privateRoute,
    path: '/preferences',
  }).lazy(() => import('./Preferences').then(d => d.Route))
}
