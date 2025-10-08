import { createRoute } from '@tanstack/react-router'

import { privateRoute } from '@/router'

/**
 * Main Dashboard route
 */
const dashboardRoute = createRoute({
  getParentRoute: () => privateRoute,
  path: '/dashboard',
}).lazy(() => import('./dashboard').then(d => d.Route))

export default dashboardRoute
