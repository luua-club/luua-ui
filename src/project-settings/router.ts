import { type AnyRoute, createRoute } from '@tanstack/react-router'

export default function getProjectSettingsRoute(privateRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => privateRoute,
    path: '/project-settings',
  }).lazy(() => import('./project-settings').then(d => d.Route))
}
