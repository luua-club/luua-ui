import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Info, Loader2, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { paymentApi } from '@/core/api/payment.api'
import { QUERY_KEYS } from '@/core/config/constant'
import { useUserState } from '@/core/hooks/user-state.hook'
import { type ISubscriptionDetails } from '@/core/models/payment.model'
import ConfirmDialog from '@/shared/components/confirm-dialog'
import { Button } from '@/shared/ui/button'

import Subscription from '../components/subscriptions'
import UsageSummary from '../components/usage-summary'

function isCancellableSubscription(subscription: ISubscriptionDetails) {
  const status = subscription.status.toLowerCase()

  return (
    subscription.plan !== 'Free' &&
    !subscription.cancelled_at &&
    !['cancelled', 'canceled', 'expired'].includes(status)
  )
}

function shouldShowPlanSyncNotice({
  storePlan,
  usagePlan,
}: {
  storePlan: string
  usagePlan?: string
}) {
  return ['Pro', 'Team'].includes(storePlan) && usagePlan === 'Free'
}

function BillingAndCredits() {
  // --- Hooks ---
  const user = useUserState()
  const queryClient = useQueryClient()
  const [showCancelDialog, setShowCancelDialog] = useState(false)

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

  // --- Variables ---
  const subscriptions = subscriptionDetails?.data?.subscriptions
  const usageSummaryData = usageSummary?.data?.usage_summary
  const showPlanSyncNotice = shouldShowPlanSyncNotice({
    storePlan: user?.plan ?? 'Free',
    usagePlan: usageSummaryData?.plan_type,
  })
  const activeSubscription = useMemo(
    () => subscriptions?.find(isCancellableSubscription),
    [subscriptions]
  )

  // --- Mutations ---
  const cancelSubscriptionMutation = useMutation({
    mutationFn: () => paymentApi.cancelSubscription(),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.subscriptionDetails],
        }),
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.usageSummary] }),
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] }),
      ])
      toast.success('Subscription cancelled')
      setShowCancelDialog(false)
    },
    onError: () => {
      toast.error('Failed to cancel subscription. Please try again.')
    },
  })

  // --- Early Return ---
  if (!user) {
    return null
  }

  return (
    <>
      {/* Display current usage statistics */}
      <UsageSummary usageSummary={usageSummaryData} />

      {showPlanSyncNotice ? (
        <div className="mb-4 flex gap-3 rounded-md border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-950 dark:border-cyan-900/70 dark:bg-cyan-950/30 dark:text-cyan-100">
          <Info className="mt-0.5 size-4 shrink-0" />
          <p className="leading-6">
            Your {user.plan} plan is active, but usage limits may take some time
            to reflect. If it is not updated in 15-20 minutes, please reach out
            to us at{' '}
            <a
              className="font-medium underline"
              href="mailto:connect@luua.club"
            >
              connect@luua.club
            </a>
            .
          </p>
        </div>
      ) : null}

      {/* Display subscription details and plans */}
      <div className="mt-4">
        <div className="mb-4 flex flex-col gap-3 rounded-md border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="font-medium">Cancel subscription</p>
            <p className="text-muted-foreground text-sm">
              Stop renewal for the active paid subscription on this
              organisation.
            </p>
          </div>
          <Button
            className="shrink-0"
            disabled={
              !activeSubscription || cancelSubscriptionMutation.isPending
            }
            onClick={() => setShowCancelDialog(true)}
            size="sm"
            type="button"
            variant="destructive"
          >
            {cancelSubscriptionMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <XCircle className="size-4" />
            )}
            Cancel subscription
          </Button>
        </div>

        <Subscription user={user} subscriptionDetails={subscriptions} />
      </div>

      <ConfirmDialog
        confirmDisabled={cancelSubscriptionMutation.isPending}
        confirmLabel="Cancel subscription"
        description="Your active subscription will stop renewing for this organisation."
        onConfirm={() => cancelSubscriptionMutation.mutate()}
        onOpenChange={open => setShowCancelDialog(open)}
        open={showCancelDialog}
        title="Cancel subscription?"
      />
    </>
  )
}

export default BillingAndCredits
