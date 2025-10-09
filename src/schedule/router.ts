import { type AnyRoute, createRoute } from '@tanstack/react-router'

export default function getScheduleRoute(privateRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => privateRoute,
    path: '/schedule',
  }).lazy(() => import('./Schedule').then(d => d.Route))
}
