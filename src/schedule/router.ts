import { createRoute } from '@tanstack/react-router'

import { privateRoute } from '@/router'

const scheduleRoute = createRoute({
  getParentRoute: () => privateRoute,
  path: '/schedule',
}).lazy(() => import('./Schedule').then(d => d.Route))

export default scheduleRoute
