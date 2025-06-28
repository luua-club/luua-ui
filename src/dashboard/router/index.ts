import { createRoute } from '@tanstack/react-router'

import { privateRoute } from '@/router'

const dashboardRoute = createRoute({
  getParentRoute: () => privateRoute,
  path: '/dashboard',
}).lazy(() => import('../pages').then(d => d.Route))

export default dashboardRoute
