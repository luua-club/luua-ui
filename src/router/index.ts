import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'

import App from '@/App'
import SidebarLayout from '@/core/layouts/SidebarLayout'
import authRoute from '@/features/auth/routes'
import dashboardRoute from '@/features/dashboard/routes'

import { AuthGuard } from './guards'

export const rootRoute = createRootRoute({
  component: App,
  loader: ({ location }) => AuthGuard({ location }),
})

export const privateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: SidebarLayout,
})

const routeTree = rootRoute.addChildren([
  authRoute,
  privateRoute.addChildren([dashboardRoute]),
])

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default router
