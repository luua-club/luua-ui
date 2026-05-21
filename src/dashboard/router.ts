import { type AnyRoute, createRoute } from '@tanstack/react-router'

import { prefetchDashboardQueries } from './config/dashboard-queries'

export default function getDashboardRoute(privateRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => privateRoute,
    path: '/dashboard',
    loader: () => prefetchDashboardQueries(),
  }).lazy(() => import('./dashboard').then(d => d.Route))
}
