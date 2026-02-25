import { type AnyRoute, createRoute } from '@tanstack/react-router'

import { createSearchSchema } from './models/url.model'

export default function getCreateDraftRouteTree(privateRoute: AnyRoute) {
  const creationRoute = createRoute({
    getParentRoute: () => privateRoute,
    path: '/create',
    validateSearch: search => createSearchSchema.parse(search),
  }).lazy(() => import('./create').then(d => d.Route))

  return creationRoute
}
