import { createRoute } from '@tanstack/react-router'

import { privateRoute } from '@/router'

const scheduleRoute = createRoute({
  getParentRoute: () => privateRoute,
  path: '/published',
}).lazy(() => import('./Published').then(d => d.Route))

export default scheduleRoute
