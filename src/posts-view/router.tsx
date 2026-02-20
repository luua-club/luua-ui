import { type AnyRoute, createRoute } from '@tanstack/react-router'

/**
 * Posts Viewhub route
 */
export default function getPostsViewRoute(privateRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => privateRoute,
    path: '/posts-view',
  }).lazy(() => import('./pages/calendar').then(d => d.Route))
}
