import { createLazyRoute } from '@tanstack/react-router'

import { PricingSection } from '@/payments/pricing-section'

function Payments() {
  return <PricingSection />
}

export const Route = createLazyRoute('/payments')({
  component: Payments,
})

export default Payments
