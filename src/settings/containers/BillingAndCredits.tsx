import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import posthog from 'posthog-js'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { paymentApi } from '@/core/api/payment.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { useUserState } from '@/core/hooks/user-state.hook'
import { ConfirmDialog } from '@/shared/components/confirm-dialog'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'

import Subscription from '../components/Subscription'
import UsageSummary from '../components/UsageSummary'

function BillingAndCredits() {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [showCancelSubscription, setShowCancelSubscription] = useState(false)
  const user = useUserState()
  const queryClient = useQueryClient()

  const { data: subscriptionDetails } = useQuery({
    queryKey: [QUERY_KEYS.subscriptionDetails],
    queryFn: () => paymentApi.getSubscriptionDetails(),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  })
  const { data: usageSummary } = useQuery({
    queryKey: [QUERY_KEYS.usageSummary],
    queryFn: () => paymentApi.getUsage(),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  })

  const cancelSubscriptionMutation = useMutation({
    mutationFn: () => paymentApi.cancelSubscription(),
    onSuccess: () => {
      posthog.capture('payments:subscription_cancelled')
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.subscriptionDetails],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.user],
      })
      toast.success('Subscription cancelled successfully')
    },
    onError: () => {
      toast.error('Failed to cancel subscription')
    },
    onSettled: () => {
      setConfirmOpen(false)
    },
  })

  useEffect(() => {
    if (
      subscriptionDetails?.data?.subscriptions.some(
        subscription => subscription.status === 'active'
      )
    ) {
      setShowCancelSubscription(true)
    } else {
      setShowCancelSubscription(false)
    }
  }, [subscriptionDetails?.data?.subscriptions])

  if (!user) {
    return null
  }

  const handleCancelSubscription = () => {
    cancelSubscriptionMutation.mutate()
  }

  return (
    <>
      <UsageSummary usageSummary={usageSummary?.data?.usage_summary} />

      <div className="mt-4">
        <Subscription
          user={user}
          subscriptionDetails={subscriptionDetails?.data?.subscriptions}
        />
      </div>

      {showCancelSubscription && (
        <div className="mt-8 space-y-3">
          <h1 className="font-bold">Cancel Subscription</h1>
          <Separator />
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div>
              <h3 className="font-medium">Are you sure ?</h3>
              <p className="text-muted-foreground text-sm">
                This action will downgrade your plan.
              </p>
            </div>

            <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
              <Trash2 className="mr-2 size-4" />
              Cancel Subscription
            </Button>
          </div>
        </div>
      )}

      {/* Cancel Subscription Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Cancel subscription?"
        description="This action cannot be undone. This will downgrade your plan."
        confirmLabel="Yes"
        cancelLabel="No"
        confirmDisabled={cancelSubscriptionMutation.isPending}
        onConfirm={() => {
          handleCancelSubscription()
        }}
      />
    </>
  )
}

export default BillingAndCredits
