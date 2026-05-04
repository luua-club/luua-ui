import { type AnyRoute, createRoute, redirect } from '@tanstack/react-router'

import { type CreateSearch } from './models/url.model'

function parseCreateSearch(search: Record<string, unknown>): CreateSearch {
  return {
    draftId: typeof search.draftId === 'string' ? search.draftId : undefined,
    source: typeof search.source === 'string' ? search.source : undefined,
  }
}

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

  const createPageRoute = createRoute({
    getParentRoute: () => creationRoute,
    path: 'create',
    validateSearch: parseCreateSearch,
  }).lazy(() => import('./pages/create').then(d => d.Route))

  return creationRoute.addChildren([creationIndexRoute, createPageRoute])
}
