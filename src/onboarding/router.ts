import { type AnyRoute, createRoute } from '@tanstack/react-router'

import { OnboardingGuard } from './guard.ts'

export default function getOnboardingRoute(rootRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => rootRoute,
    path: '/onboarding',
    loader: () => OnboardingGuard(),
  }).lazy(() => import('./onboarding').then(d => d.Route))
}
