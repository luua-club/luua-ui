import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'

import App from '@/App'
import authRoute from '@/auth/router'
import SidebarLayout from '@/core/layouts/SidebarLayout'
import dashboardRoute from '@/dashboard/router'
import settingsRoute from '@/settings/router'

import { AuthGuard } from './guards/guards'

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
  privateRoute.addChildren([dashboardRoute, settingsRoute]),
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
