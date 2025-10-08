import { createRoute } from '@tanstack/react-router'

import { rootRoute } from '@/router'

import Login from './login'

/**
 * Auth Route
 */
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
})

export default authRoute
