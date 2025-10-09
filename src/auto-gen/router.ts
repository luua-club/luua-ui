import { type AnyRoute, createRoute, redirect } from '@tanstack/react-router'

export default function getAutoGenRouteTree(privateRoute: AnyRoute) {
  /**
   * Main Route - auto-gen
   */
  const autoGenRoute = createRoute({
    getParentRoute: () => privateRoute,
    path: '/auto-gen',
  }).lazy(() => import('./pages').then(d => d.Route))

  /**
   * Index Route redirect to auto-gen/inspiration
   */
  const autoGenIndexRoute = createRoute({
    getParentRoute: () => autoGenRoute,
    path: '/',
    loader: () => {
      throw redirect({ to: '/auto-gen/inspiration' })
    },
  })

  /**
   * Inspiration Route - auto-gen/inspiration
   */
  const inspirationPageRoute = createRoute({
    getParentRoute: () => autoGenRoute,
    path: 'inspiration',
  }).lazy(() => import('./pages/inspiration').then(d => d.Route))

  /**
   * AI Drafts Route - auto-gen/drafts
   */
  const draftsPageRoute = createRoute({
    getParentRoute: () => autoGenRoute,
    path: 'drafts',
  }).lazy(() => import('./pages/ai-drafts').then(d => d.Route))

  /**
   * AutoGen Route Tree
   */
  return autoGenRoute.addChildren([
    autoGenIndexRoute,
    inspirationPageRoute,
    draftsPageRoute,
  ])
}
