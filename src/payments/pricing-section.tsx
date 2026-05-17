import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CircleCheck } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { paymentApi } from '@/core/api/payment.api'
import { API_CONSTANTS, QUERY_KEYS } from '@/core/config/constant'
import { useUserState } from '@/core/hooks/user-state.hook'
import { type ApiError } from '@/core/models/api.model'
import {
  CurrentPlanAffordance,
  IncludedPlanAffordance,
} from '@/payments/current-plan-affordance'
import { PlanPriceTag } from '@/payments/plan-price-tag'
import { PlanUpgradeButton } from '@/payments/plan-upgrade-button'
import { PricingCompareTable } from '@/payments/pricing-compare-table'
import {
  type BillingPlanId,
  isHigherTier,
  isPurchasablePlan,
  PLAN_CARD_COPY,
  PLAN_CARD_FEATURES,
  PLAN_ICONS,
  PLAN_IDS,
  type PlanId,
  type PurchasablePlan,
} from '@/payments/pricing-data'
import { RedemptionCodeSection } from '@/payments/redemption-code-section'
import ConfirmDialog from '@/shared/components/confirm-dialog'
import { AnimatedGradientText } from '@/shared/ui/animated-gradient-text'
import { DiagonalStripe } from '@/shared/ui/diagonal-stripe'

function isActiveSubscriptionError(error: unknown) {
  const apiError = error as ApiError

  return (
    typeof apiError.detail === 'object' &&
    apiError.detail?.error_code ===
      API_CONSTANTS.errorCode.activeSubscriptionFound
  )
}

type CheckoutFlowInput = {
  plan: PurchasablePlan
  cancelCurrentPlan?: boolean
}

export function PricingSection() {
  const user = useUserState()
  const activePlan: BillingPlanId = user?.plan ?? 'Free'
  const queryClient = useQueryClient()
  const [upgradeIntent, setUpgradeIntent] = useState<PurchasablePlan | null>(
    null
  )
  const paymentLinkMutation = useMutation({
    mutationFn: async ({ plan, cancelCurrentPlan }: CheckoutFlowInput) => {
      if (cancelCurrentPlan) {
        await paymentApi.cancelSubscription()
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.subscriptionDetails],
          }),
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.usageSummary],
          }),
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] }),
        ])
      }

      return paymentApi.createPaymentLink({
        plan,
        subscription_type: 'monthly',
      })
    },
    onSuccess: response => {
      const paymentLink = response.data.payment_link

      if (!paymentLink) {
        toast.error('Payment link is unavailable. Please try again.')
        return
      }

      window.location.href = paymentLink
    },
    onError: (error, variables) => {
      if (isActiveSubscriptionError(error)) {
        if (!variables.cancelCurrentPlan) {
          setUpgradeIntent(variables.plan)
          return
        }

        toast.error('Cancel your current subscription before changing plans.')
        return
      }

      toast.error('Failed to start checkout. Please try again.')
    },
  })

  const upgradingPlan = paymentLinkMutation.isPending
    ? paymentLinkMutation.variables?.plan
    : undefined

  const handleUpgradePlan = (plan: PurchasablePlan) => {
    if (activePlan !== 'Free' && isHigherTier(plan, activePlan)) {
      setUpgradeIntent(plan)
      return
    }

    paymentLinkMutation.mutate({ plan })
  }

  const handleConfirmPlanChange = () => {
    if (!upgradeIntent) return

    paymentLinkMutation.mutate(
      { plan: upgradeIntent, cancelCurrentPlan: true },
      {
        onSettled: () => setUpgradeIntent(null),
      }
    )
  }

  return (
    <>
      <section className="w-full">
        {/* Single content column with continuous side borders (matches marketing table) */}
        <div className="mx-auto w-full max-w-7xl border-x">
          <DiagonalStripe className="h-8 border-x-0 border-b" />
          <div className="flex flex-col items-center justify-center px-4 pt-8 sm:px-6 md:px-8">
            <AnimatedGradientText className="text-sm">
              Pricing
            </AnimatedGradientText>

            <h2 className="text-center tracking-[0.04em] text-balance sm:text-[2rem]">
              Simple and Feasible Pricing
            </h2>

            <div className="mt-8 grid w-full max-w-full grid-cols-1 gap-x-6 gap-y-8 overflow-clip sm:mt-10 sm:grid-cols-2 md:grid-cols-3">
              {activePlan === 'Free' ? (
                <div className="col-span-full min-w-0">
                  <RedemptionCodeSection orgRole={user?.currentOrg?.org_role} />
                </div>
              ) : null}
              {PLAN_IDS.map(planId => (
                <div className="min-w-0" key={planId}>
                  <PlanCard
                    activePlan={activePlan}
                    isUpgradePending={paymentLinkMutation.isPending}
                    onUpgradePlan={handleUpgradePlan}
                    planId={planId}
                    upgradingPlan={upgradingPlan}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-border mt-16 border-t" aria-hidden />

          <PricingCompareTable
            activePlan={activePlan}
            isUpgradePending={paymentLinkMutation.isPending}
            onUpgradePlan={handleUpgradePlan}
            upgradingPlan={upgradingPlan}
          />
          <DiagonalStripe className="h-8 border-x-0 border-t" />
        </div>
      </section>

      <ConfirmDialog
        cancelLabel="Not now"
        confirmDisabled={paymentLinkMutation.isPending}
        confirmLabel="Cancel and upgrade"
        description={`To upgrade from ${activePlan} to ${upgradeIntent ?? 'this plan'}, we need to cancel your current subscription first. After that, checkout for the new plan will start automatically.`}
        onConfirm={handleConfirmPlanChange}
        onOpenChange={open => {
          if (!open && !paymentLinkMutation.isPending) {
            setUpgradeIntent(null)
          }
        }}
        open={upgradeIntent !== null}
        title="Cancel current plan first?"
      />
    </>
  )
}

function PlanCard({
  planId,
  activePlan,
  onUpgradePlan,
  isUpgradePending,
  upgradingPlan,
}: {
  planId: PlanId
  activePlan: BillingPlanId
  onUpgradePlan: (planId: PurchasablePlan) => void
  isUpgradePending: boolean
  upgradingPlan?: PurchasablePlan
}) {
  const copy = PLAN_CARD_COPY[planId]
  const Icon = PLAN_ICONS[planId]
  const isActive = activePlan === planId
  const canUpgrade = isHigherTier(planId, activePlan)
  const canSelfServeUpgrade = canUpgrade && isPurchasablePlan(planId)
  const isUpgradeLoading = upgradingPlan === planId

  return (
    <div className="bg-muted/50 dark:bg-muted/75 relative flex flex-col rounded-xl border p-1">
      <div className="bg-background relative overflow-hidden rounded-lg border px-6 pt-5 pb-4 shadow-sm dark:shadow-black/20">
        <Icon className="text-primary relative z-10 mb-5" />
        <div className="relative z-10 flex items-center gap-1">
          <h3 className="text-2xl font-medium tracking-tight">{copy.title}</h3>
        </div>
        <p className="text-muted-foreground relative z-10 mt-1 mb-2">
          {copy.description}
        </p>
      </div>

      <div className="bg-background mt-1 grow rounded-lg border px-6 pt-5 pb-10 shadow-sm dark:shadow-black/20">
        <PlanPriceTag className="mt-4" planId={planId} />
        {isActive ? (
          <CurrentPlanAffordance />
        ) : canSelfServeUpgrade ? (
          <PlanUpgradeButton
            className="my-6 w-full"
            isLoading={isUpgradeLoading}
            isPending={isUpgradePending}
            onUpgradePlan={onUpgradePlan}
            planId={planId}
            size="lg"
            variant={copy.isRecommended ? 'default' : 'outline'}
          />
        ) : (
          <IncludedPlanAffordance />
        )}
        <ul className="mt-4 space-y-2">
          {PLAN_CARD_FEATURES[planId].map(feature => (
            <li className="flex items-center gap-2" key={feature}>
              <CircleCheck className="fill-primary/10 text-primary dark:fill-primary/15 size-4 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
