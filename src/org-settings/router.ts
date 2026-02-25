import { type AnyRoute, createRoute } from '@tanstack/react-router'

export default function getOrgSettingsRoute(privateRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => privateRoute,
    path: '/org-settings',
  }).lazy(() => import('./org-settings').then(d => d.Route))
}
