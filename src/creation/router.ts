import { type AnyRoute, createRoute, redirect } from '@tanstack/react-router'

export default function getCreationRouteTree(privateRoute: AnyRoute) {
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

  //TODO: REMOVE TEMP ROUTE
  const createPageRoute = createRoute({
    getParentRoute: () => creationRoute,
    path: 'create',
  }).lazy(() => import('./pages/create-new').then(d => d.Route))

  const draftsPageRoute = createRoute({
    getParentRoute: () => creationRoute,
    path: 'drafts',
  }).lazy(() => import('./pages/drafts').then(d => d.Route))

  return creationRoute.addChildren([
    creationIndexRoute,
    createPageRoute,
    draftsPageRoute,
  ])
}
