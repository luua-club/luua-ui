import { type AnyRoute, createRoute } from '@tanstack/react-router'

/**
 * Review route
 */
export default function getReviewRoute(privateRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => privateRoute,
    path: '/review/$draftId',
  }).lazy(() => import('./review').then(d => d.Route))
}
