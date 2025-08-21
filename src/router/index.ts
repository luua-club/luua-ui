import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'

import { AppContent } from '@/App'
import authRoute from '@/auth/router'
import SidebarLayout from '@/core/layouts/SidebarLayout'
import creationRouteTree from '@/creation/router'
import dashboardRoute from '@/dashboard/router'
import publishedRoute from '@/published/router'
import quickShareRoute from '@/quick-share/router'
import scheduleRoute from '@/schedule/router'
import settingsRouteTree from '@/settings/router'

import { AuthGuard } from './guards'

export const rootRoute = createRootRoute({
  component: AppContent,
  loader: ({ location }) => AuthGuard({ location }),
})

export const privateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: SidebarLayout,
})

const routeTree = rootRoute.addChildren([
  authRoute,
  privateRoute.addChildren([
    dashboardRoute,
    scheduleRoute,
    settingsRouteTree,
    quickShareRoute,
    creationRouteTree,
    publishedRoute,
  ]),
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
