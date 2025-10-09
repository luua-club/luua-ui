import { type AnyRoute, createRoute } from '@tanstack/react-router'

export default function getPaymentsRoute(privateRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => privateRoute,
    path: '/payments',
  }).lazy(() => import('./Payments').then(d => d.Route))
}
