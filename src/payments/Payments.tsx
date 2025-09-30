import { createLazyRoute } from '@tanstack/react-router'

import PlanCards from './containers/PlanCards'

function Payments() {
  return (
    <div className="m-auto max-w-4xl p-2">
      <div className="mt-4 py-4 text-center">
        <h1 className="text-3xl font-bold">Pricing Details</h1>
        <p className="text-muted-foreground my-2">
          A Comprehensive Breakdown of Our Pricing Plans to Help You Make the
          Best Choice!
        </p>
      </div>
      <PlanCards />
    </div>
  )
}

export const Route = createLazyRoute('/payments')({
  component: Payments,
})

export default Payments
