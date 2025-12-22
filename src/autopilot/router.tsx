import { type AnyRoute, createRoute } from '@tanstack/react-router'

/**
 * Welcome route
 */
export default function getAutoPilotRoute(privateRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => privateRoute,
    path: '/autopilot',
  }).lazy(() => import('./autopilot').then(d => d.Route))
}
