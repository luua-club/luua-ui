import { createRoute, redirect } from '@tanstack/react-router'

import { privateRoute } from '@/router'

const creationRoute = createRoute({
  getParentRoute: () => privateRoute,
  path: '/creation',
}).lazy(() => import('./pages').then(d => d.Route))

const creationIndexRoute = createRoute({
  getParentRoute: () => creationRoute,
  path: '/',
  loader: () => {
    throw redirect({ to: '/creation/create' })
  },
})

const createPageRoute = createRoute({
  getParentRoute: () => creationRoute,
  path: 'create',
}).lazy(() => import('./pages/create').then(d => d.Route))

const draftsPageRoute = createRoute({
  getParentRoute: () => creationRoute,
  path: 'drafts',
}).lazy(() => import('./pages/drafts').then(d => d.Route))

const creationRouteTree = creationRoute.addChildren([
  creationIndexRoute,
  createPageRoute,
  draftsPageRoute,
])

export default creationRouteTree
