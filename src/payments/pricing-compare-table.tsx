import { Check, Info, Mail, X } from 'lucide-react'
import type { ReactNode } from 'react'

import {
  CurrentPlanAffordance,
  IncludedPlanAffordance,
} from '@/payments/current-plan-affordance'
import { PlanPriceTag } from '@/payments/plan-price-tag'
import { PlanUpgradeButton } from '@/payments/plan-upgrade-button'
import {
  type BillingPlanId,
  COMPARISON_ROWS,
  ENTERPRISE_FEATURES,
  isHigherTier,
  isPurchasablePlan,
  type PlanId,
  type PurchasablePlan,
} from '@/payments/pricing-data'
import { Button } from '@/shared/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip'
import { cn } from '@/shared/utils/index'

type CellValue = boolean | string

function CompareCell({ value }: { value: CellValue }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check
        aria-label="Included"
        className="text-muted-foreground mx-auto size-5"
        strokeWidth={2}
      />
    ) : (
      <X
        aria-label="Not included"
        className="text-muted-foreground/50 mx-auto size-5"
        strokeWidth={2}
      />
    )
  }
  return <span className="text-sm">{value}</span>
}

const COMPARISON_ROW_INFO: Partial<Record<string, ReactNode>> = {
  'Credits per month': (
    <div className="space-y-4">
      <div>
        <p className="text-foreground text-base leading-none font-semibold">
          How credits work
        </p>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          Credits are consumed per AI action, not per post. A single post may
          use several actions depending on features used.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          ['1', 'Text generation'],
          ['2', 'Web search'],
          ['5', 'Image generation'],
        ].map(([credits, label]) => (
          <div
            className="bg-muted/40 grid h-20 grid-rows-[2rem_1rem] place-items-center content-center rounded-md border px-2 py-3 text-center"
            key={label}
          >
            <div className="text-foreground text-2xl leading-none font-semibold">
              {credits}
            </div>
            <div className="text-muted-foreground text-[11px] leading-none whitespace-nowrap">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  Projects: (
    <div>
      <p className="text-foreground text-base leading-none font-semibold">
        What a project includes
      </p>
      <p className="text-muted-foreground mt-2 text-sm leading-6">
        Each project can hold 1 X account, 1 LinkedIn account, and 1 Instagram
        account.
      </p>
    </div>
  ),
}

function ComparisonLabel({ label }: { label: string }) {
  const info = COMPARISON_ROW_INFO[label]

  if (!info) return label

  return (
    <span className="inline-flex items-center gap-1.5">
      {label}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex size-4 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
            aria-label={`More about ${label}`}
          >
            <Info className="size-3.5" strokeWidth={2} />
          </button>
        </TooltipTrigger>
        <TooltipContent
          hideArrow
          className="bg-popover text-popover-foreground w-[26rem] max-w-[calc(100vw-2rem)] border p-4 text-left shadow-md"
          side="top"
          sideOffset={8}
        >
          {info}
        </TooltipContent>
      </Tooltip>
    </span>
  )
}

export interface PricingCompareTableProps {
  activePlan: BillingPlanId
  onUpgradePlan: (planId: PurchasablePlan) => void
  isUpgradePending: boolean
  upgradingPlan?: PurchasablePlan
}

export function PricingCompareTable({
  activePlan,
  onUpgradePlan,
  isUpgradePending,
  upgradingPlan,
}: PricingCompareTableProps) {
  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="divide-border divide-x border-b">
              <th className="text-muted-foreground min-w-[200px] pt-10 pr-4 pb-6 pl-4 align-bottom font-medium sm:pl-6 md:pl-8">
                Monthly plans
              </th>
              <PlanColumnHeader
                planId="Free"
                title="Free"
                activePlan={activePlan}
                ctaVariant="outline"
                isUpgradePending={isUpgradePending}
                onUpgradePlan={onUpgradePlan}
                upgradingPlan={upgradingPlan}
              />
              <PlanColumnHeader
                planId="Pro"
                title="Pro"
                activePlan={activePlan}
                ctaVariant="default"
                isUpgradePending={isUpgradePending}
                onUpgradePlan={onUpgradePlan}
                upgradingPlan={upgradingPlan}
              />
              <PlanColumnHeader
                planId="Team"
                title="Team"
                activePlan={activePlan}
                ctaVariant="outline"
                className="pr-4 sm:pr-6 md:pr-8"
                isUpgradePending={isUpgradePending}
                onUpgradePlan={onUpgradePlan}
                upgradingPlan={upgradingPlan}
              />
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row, i) => (
              <tr
                key={row.label}
                className={cn(
                  'divide-border divide-x border-b',
                  i % 2 === 0 ? 'bg-muted/40' : 'bg-background'
                )}
              >
                <td className="py-4 pr-4 pl-4 font-medium sm:pl-6 md:pl-8">
                  <ComparisonLabel label={row.label} />
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex justify-center">
                    <CompareCell value={row.free} />
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex justify-center">
                    <CompareCell value={row.pro} />
                  </div>
                </td>
                <td className="px-4 py-4 text-center sm:pr-6 md:pr-8">
                  <div className="flex justify-center">
                    <CompareCell value={row.team} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 pt-8 sm:px-6 md:px-8">
        <div className="bg-muted/50 dark:bg-muted/75 rounded-xl border p-1">
          <div className="bg-background rounded-lg border px-6 py-6 shadow-sm sm:px-8 sm:py-8 lg:grid lg:grid-cols-[minmax(220px,300px)_1fr] lg:items-start lg:gap-10 dark:shadow-black/20">
            <div>
              <h3 className="max-w-56 text-2xl leading-tight font-medium tracking-normal text-balance sm:text-3xl">
                Enterprise
              </h3>
              <p className="text-muted-foreground mt-4 max-w-72 text-base leading-7">
                Beyond Team (5 projects): custom limits, security, and billing
                for large organizations. Need dedicated support or volume
                pricing? Let&apos;s tailor a plan.
              </p>
              <Button asChild className="mt-6 px-6" size="default">
                <a href="mailto:connect@luua.club">Contact sales</a>
              </Button>
            </div>

            <ul className="mt-8 grid auto-rows-min content-start items-start gap-x-6 gap-y-4 sm:grid-cols-2 lg:mt-1 lg:w-full lg:max-w-[720px] lg:grid-cols-3 lg:self-start lg:justify-self-start">
              {ENTERPRISE_FEATURES.map(feature => (
                <li
                  className="text-muted-foreground flex items-start gap-2.5 text-sm leading-6 font-medium"
                  key={feature}
                >
                  <span className="bg-muted text-muted-foreground mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border">
                    <Check className="size-3.5" strokeWidth={2.5} />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 sm:px-6 md:px-8">
        <div className="bg-muted/40 text-muted-foreground flex flex-col gap-3 rounded-lg border px-4 py-4 text-sm leading-6 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="bg-background text-foreground flex size-8 shrink-0 items-center justify-center rounded-md border">
              <Mail className="size-4" />
            </span>
            <p className="text-accent-foreground min-w-0 font-medium">
              Need more credits or projects? We offer custom credit packs and
              project add-ons tailored to your workflow.
            </p>
          </div>
          <Button asChild className="shrink-0" size="sm" variant="default">
            <a href="mailto:connect@luua.club">Email us</a>
          </Button>
        </div>
      </div>
    </div>
  )
}

function PlanColumnHeader({
  planId,
  title,
  activePlan,
  ctaVariant,
  className,
  onUpgradePlan,
  isUpgradePending,
  upgradingPlan,
}: {
  planId: PlanId
  title: string
  activePlan: BillingPlanId
  ctaVariant: 'default' | 'outline'
  className?: string
  onUpgradePlan: (planId: PurchasablePlan) => void
  isUpgradePending: boolean
  upgradingPlan?: PurchasablePlan
}) {
  const canUpgrade = isHigherTier(planId, activePlan)
  const canSelfServeUpgrade = canUpgrade && isPurchasablePlan(planId)
  const isUpgradeLoading = upgradingPlan === planId

  return (
    <th className={cn('min-w-[160px] px-4 pt-10 pb-6 align-bottom', className)}>
      <div className="text-lg font-medium">{title}</div>
      <PlanPriceTag className="mt-2" planId={planId} size="compact" />
      {activePlan === planId ? (
        <CurrentPlanAffordance size="compact" />
      ) : canSelfServeUpgrade ? (
        <PlanUpgradeButton
          className="mt-4 w-full"
          isLoading={isUpgradeLoading}
          isPending={isUpgradePending}
          onUpgradePlan={onUpgradePlan}
          planId={planId}
          size="sm"
          variant={ctaVariant}
        />
      ) : (
        <IncludedPlanAffordance size="compact" />
      )}
    </th>
  )
}
