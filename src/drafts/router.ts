import { type AnyRoute, createRoute } from '@tanstack/react-router'

export default function getDraftsRoute(privateRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => privateRoute,
    path: '/drafts',
  }).lazy(() => import('./drafts').then(d => d.Route))
}
