import { createRoute } from '@tanstack/react-router'

import { privateRoute } from '@/router'

const quickShareRoute = createRoute({
  getParentRoute: () => privateRoute,
  path: '/quick-share',
}).lazy(() => import('./QuickShare').then(d => d.Route))

export default quickShareRoute
