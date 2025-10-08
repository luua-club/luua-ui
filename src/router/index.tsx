import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'

import { AppContent } from '@/App'
import authRoute from '@/auth/router'
import autoGenRouteTree from '@/auto-gen/router'
import SidebarLayout from '@/core/layouts/SidebarLayout'
import creationRouteTree from '@/creation/router'
import dashboardRoute from '@/dashboard/router'
import onboardingRoute from '@/onboarding/router'
import paymentsRoute from '@/payments/router'
import preferencesRoute from '@/preferences/router'
import publishedRoute from '@/published/router'
import scheduleRoute from '@/schedule/router'
import settingsRouteTree from '@/settings/router'
import GlobalLoader from '@/shared/components/global-loader'

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
  onboardingRoute,
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
