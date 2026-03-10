import { useQuery } from '@tanstack/react-query'

import { paymentApi } from '@/core/api/payment.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { useUserState } from '@/core/hooks/user-state.hook'

import Subscription from '../components/subscriptions'
import UsageSummary from '../components/usage-summary'

function BillingAndCredits() {
  // --- Hooks ---
  const user = useUserState()

  // --- Queries ---
  /**
   * Fetch subscription details (always fresh data)
   */
  const { data: subscriptionDetails } = useQuery({
    queryKey: [QUERY_KEYS.subscriptionDetails],
    queryFn: () => paymentApi.getSubscriptionDetails(),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  })

  /**
   * Fetch usage summary (always fresh data)
   */
  const { data: usageSummary } = useQuery({
    queryKey: [QUERY_KEYS.usageSummary],
    queryFn: () => paymentApi.getUsage(),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  })

  // --- Early Return ---
  if (!user) {
    return null
  }

  return (
    <>
      {/* Display current usage statistics */}
      <UsageSummary usageSummary={usageSummary?.data?.usage_summary} />

      {/* Display subscription details and plans */}
      <div className="mt-4">
        <Subscription
          user={user}
          subscriptionDetails={subscriptionDetails?.data?.subscriptions}
        />
      </div>
    </>
  )
}

export default BillingAndCredits
