import { createRoute } from '@tanstack/react-router'

import { privateRoute } from '@/router'

const settingsRoute = createRoute({
  getParentRoute: () => privateRoute,
  path: '/settings',
}).lazy(() => import('../pages/Settings').then(d => d.Route))

export default settingsRoute
