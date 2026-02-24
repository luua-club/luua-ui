import { type AnyRoute, createRoute, redirect } from '@tanstack/react-router'

import type { postStatusType } from '@/core/models/post.model'

/**
 * Posts Viewhub route tree
 */
export default function getPostsViewRoute(privateRoute: AnyRoute) {
  const postsViewRoute = createRoute({
    getParentRoute: () => privateRoute,
    path: '/posts-view',
  }).lazy(() => import('./pages/all-posts').then(d => d.Route))

  const postsViewIndexRoute = createRoute({
    getParentRoute: () => postsViewRoute,
    path: '/',
    loader: () => {
      throw redirect({ to: '/posts-view/calendar' })
    },
  })

  const postsViewCalendarRoute = createRoute({
    getParentRoute: () => postsViewRoute,
    path: 'calendar',
  }).lazy(() => import('./pages/calendar').then(d => d.Route))

  const postsViewListRoute = createRoute({
    getParentRoute: () => postsViewRoute,
    path: 'list',
    validateSearch: (search: Record<string, unknown>) => ({
      status: (search.status as postStatusType) ?? undefined,
      from: (search.from as string) ?? undefined,
      to: (search.to as string) ?? undefined,
      sort: (search.sort as 'asc' | 'desc') ?? undefined,
      offset: search.offset ? Number(search.offset) : undefined,
    }),
  }).lazy(() => import('./pages/post-list-view').then(d => d.Route))

  return postsViewRoute.addChildren([
    postsViewIndexRoute,
    postsViewCalendarRoute,
    postsViewListRoute,
  ])
}
