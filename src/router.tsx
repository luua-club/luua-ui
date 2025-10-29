import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'

import { AppContent } from '@/App'
import getAuthRoute from '@/auth/router'
import getAutoGenRouteTree from '@/auto-gen/router'
import MainLayout from '@/core/layouts/main-layout'
import getCreationRouteTree from '@/creation/router'
import getDashboardRoute from '@/dashboard/router'
import getPaymentsRoute from '@/payments/router'
import getPreferencesRoute from '@/preferences/router'
import getPublishedRoute from '@/published/router'
import getScheduleRoute from '@/schedule/router'
import getSettingsRouteTree from '@/settings/router'
import GlobalLoader from '@/shared/components/global-loader'

import { AuthGuard } from './guards'

export const rootRoute = createRootRoute({
  component: AppContent,
  loader: ({ location }) => AuthGuard({ location }),
})

export const privateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: MainLayout,
})

const authRoute = getAuthRoute(rootRoute)
const dashboardRoute = getDashboardRoute(privateRoute)
const scheduleRoute = getScheduleRoute(privateRoute)
const settingsRouteTree = getSettingsRouteTree(privateRoute)
const creationRouteTree = getCreationRouteTree(privateRoute)
const publishedRoute = getPublishedRoute(privateRoute)
const preferencesRoute = getPreferencesRoute(privateRoute)
const autoGenRouteTree = getAutoGenRouteTree(privateRoute)
const paymentsRoute = getPaymentsRoute(privateRoute)

const routeTree = rootRoute.addChildren([
  authRoute,
  privateRoute.addChildren([
    dashboardRoute,
    scheduleRoute,
    settingsRouteTree,
    creationRouteTree,
    publishedRoute,
    preferencesRoute,
    autoGenRouteTree,
    paymentsRoute,
  ]),
])

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultPendingComponent: () => <GlobalLoader />,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default router
