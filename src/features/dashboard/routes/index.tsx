import { createRoute, lazyRouteComponent } from '@tanstack/react-router'

import rootRoute from '@/App'

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: lazyRouteComponent(() => import('../pages/Dashboard')),
})
export default dashboardRoute
