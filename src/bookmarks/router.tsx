import { type AnyRoute, createRoute } from '@tanstack/react-router'

/**
 * Welcome route
 */
export default function getBookmarksRoute(privateRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => privateRoute,
    path: '/bookmarks',
  }).lazy(() => import('./bookmarks').then(d => d.Route))
}
