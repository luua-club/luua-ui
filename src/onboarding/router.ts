import { createRoute } from '@tanstack/react-router'

import { rootRoute } from '@/router'

import { OnboardingGuard } from './guard.ts'

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding',
  loader: () => OnboardingGuard(),
}).lazy(() => import('./onboarding').then(d => d.Route))

export default onboardingRoute
