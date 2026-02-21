import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'

import { AppContent } from '@/App'
import getAuthRoute from '@/auth/router'
import MainLayout from '@/core/layouts/main-layout'
import getCreationRouteTree from '@/creation/router'
import getPaymentsRoute from '@/payments/router'
import getPreferencesRoute from '@/preferences/router'
import getPublishedRoute from '@/published/router'
import getReviewRoute from '@/review/router'
import getScheduleRoute from '@/schedule/router'
import getSettingsRouteTree from '@/settings/router'
import GlobalLoader from '@/shared/components/global-loader'
import getWelcomeRoute from '@/welcome/router'

import getAutoPilotRoute from './autopilot/router'
import getBookmarksRoute from './bookmarks/router'
import getDashboardRoute from './dashboard/router'
import getDraftsRoute from './drafts/router'
import { AuthGuard } from './guards'
import getPostsViewRoute from './posts-view/router'

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
const scheduleRoute = getScheduleRoute(privateRoute)
const settingsRouteTree = getSettingsRouteTree(privateRoute)
const creationRouteTree = getCreationRouteTree(privateRoute)
const dashboardRoute = getDashboardRoute(privateRoute)
const draftsRoute = getDraftsRoute(privateRoute)
const publishedRoute = getPublishedRoute(privateRoute)
const preferencesRoute = getPreferencesRoute(privateRoute)
const paymentsRoute = getPaymentsRoute(privateRoute)
const welcomeRoute = getWelcomeRoute(privateRoute)
const bookmarksRoute = getBookmarksRoute(privateRoute)
const autopilotRoute = getAutoPilotRoute(privateRoute)
const reviewRoute = getReviewRoute(privateRoute)
const postsViewhubRoute = getPostsViewRoute(privateRoute)

const routeTree = rootRoute.addChildren([
  authRoute,
  privateRoute.addChildren([
    scheduleRoute,
    settingsRouteTree,
    creationRouteTree,
    dashboardRoute,
    draftsRoute,
    publishedRoute,
    preferencesRoute,
    paymentsRoute,
    welcomeRoute,
    bookmarksRoute,
    autopilotRoute,
    reviewRoute,
    postsViewhubRoute,
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
