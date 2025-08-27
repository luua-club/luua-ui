import { createRoute } from '@tanstack/react-router'

import { privateRoute } from '@/router'

const preferencesRoute = createRoute({
  getParentRoute: () => privateRoute,
  path: '/preferences',
}).lazy(() => import('./pages').then(d => d.Route))

export default preferencesRoute
