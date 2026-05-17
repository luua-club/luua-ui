import { type AnyRoute, createRoute } from '@tanstack/react-router'

import { parsePaymentsSearch } from './payments-search'

export default function getPaymentsRoute(privateRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => privateRoute,
    path: '/payments',
    validateSearch: parsePaymentsSearch,
  }).lazy(() => import('./Payments').then(d => d.Route))
}
