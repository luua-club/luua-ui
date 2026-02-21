import { type AnyRoute, createRoute } from '@tanstack/react-router'

import { createSearchSchema } from './models/create-search.model'

export default function getCreationRouteTree(privateRoute: AnyRoute) {
  const creationRoute = createRoute({
    getParentRoute: () => privateRoute,
    path: '/creation',
  }).lazy(() => import('./pages').then(d => d.Route))

  const creationIndexRoute = createRoute({
    getParentRoute: () => creationRoute,
    path: '/',
  }).lazy(() => import('./pages/landing').then(d => d.Route))

  const createPageRoute = createRoute({
    getParentRoute: () => creationRoute,
    path: 'create',
    validateSearch: search => createSearchSchema.parse(search),
  }).lazy(() => import('./pages/create').then(d => d.Route))

  return creationRoute.addChildren([creationIndexRoute, createPageRoute])
}
