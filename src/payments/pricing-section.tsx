import { CircleCheck } from 'lucide-react'

import { useUserState } from '@/core/hooks/user-state.hook'
import { CurrentPlanAffordance } from '@/payments/current-plan-affordance'
import { PlanPriceTag } from '@/payments/plan-price-tag'
import { PricingCompareTable } from '@/payments/pricing-compare-table'
import {
  isHigherTier,
  PLAN_CARD_COPY,
  PLAN_CARD_FEATURES,
  PLAN_ICONS,
  PLAN_IDS,
  PLAN_UPGRADE_CTA,
  type PlanId,
} from '@/payments/pricing-data'
import { AnimatedGradientText } from '@/shared/ui/animated-gradient-text'
import { Badge } from '@/shared/ui/badge'
import { BorderBeam } from '@/shared/ui/border-beam'
import { Button } from '@/shared/ui/button'
import { DiagonalStripe } from '@/shared/ui/diagonal-stripe'
import { cn } from '@/shared/utils/index'

export function PricingSection() {
  const activePlan = useUserState()?.plan ?? 'Free'

  return (
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

          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-8 overflow-clip sm:mt-12 sm:grid-cols-2 md:grid-cols-3">
            {PLAN_IDS.map(planId => (
              <PlanCard key={planId} planId={planId} activePlan={activePlan} />
            ))}
          </div>
        </div>

        <div className="border-border mt-16 border-t" aria-hidden />

        <PricingCompareTable activePlan={activePlan} />
        <DiagonalStripe className="h-8 border-x-0 border-t" />
      </div>
    </section>
  )
}

function PlanCard({
  planId,
  activePlan,
}: {
  planId: PlanId
  activePlan: PlanId
}) {
  const copy = PLAN_CARD_COPY[planId]
  const Icon = PLAN_ICONS[planId]
  const isActive = activePlan === planId
  const canUpgrade = isHigherTier(planId, activePlan)
  const shouldHighlightUpgrade = activePlan === 'Free' && planId === 'Pro'

  return (
    <div
      className={cn(
        'bg-muted/50 dark:bg-muted/75 relative flex flex-col rounded-xl border p-1',
        shouldHighlightUpgrade && 'shadow-sm'
      )}
    >
      {shouldHighlightUpgrade ? (
        <BorderBeam borderWidth={1} duration={8} size={120} />
      ) : null}

      <div className="bg-background relative overflow-hidden rounded-lg border px-6 pt-5 pb-4 shadow-sm dark:shadow-black/20">
        {shouldHighlightUpgrade ? (
          <Badge className="absolute top-3 right-3" variant={'destructive'}>
            Most Popular
          </Badge>
        ) : null}
        {shouldHighlightUpgrade && (
          <div
            className="pointer-events-none absolute inset-0 -top-px -left-2 z-0 not-dark:opacity-50"
            style={{
              backgroundImage: `
        repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
        repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
        radial-gradient(circle at 20px 20px, rgba(55, 65, 81, 0.12) 2px, transparent 2px),
        radial-gradient(circle at 40px 40px, rgba(55, 65, 81, 0.12) 2px, transparent 2px)
      `,
              backgroundSize: '40px 40px, 40px 40px, 40px 40px, 40px 40px',
            }}
          />
        )}
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
        ) : canUpgrade ? (
          <Button
            className="my-6 w-full"
            size="lg"
            variant={copy.isRecommended ? 'default' : 'outline'}
          >
            {PLAN_UPGRADE_CTA}
          </Button>
        ) : (
          <div className="my-6 h-10" aria-hidden />
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
