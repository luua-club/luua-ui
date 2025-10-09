import { type AnyRoute, createRoute } from '@tanstack/react-router'

export default function getPublishedRoute(privateRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => privateRoute,
    path: '/published',
  }).lazy(() => import('./Published').then(d => d.Route))
}
