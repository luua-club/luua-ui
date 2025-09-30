import { createRoute } from '@tanstack/react-router'

import { privateRoute } from '@/router'

const paymentsRoute = createRoute({
  getParentRoute: () => privateRoute,
  path: '/payments',
}).lazy(() => import('./Payments').then(d => d.Route))

export default paymentsRoute
