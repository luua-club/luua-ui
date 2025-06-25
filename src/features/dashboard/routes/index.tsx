import { createRoute } from '@tanstack/react-router'

import rootRoute from '@/App'

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
}).lazy(() => import('../pages/Dashboard').then(d => d.Route))

export default dashboardRoute
