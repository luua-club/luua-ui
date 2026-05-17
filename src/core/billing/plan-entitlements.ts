import type { BillingPlan } from '@/core/models/org.model'
import type { IUsageSummary } from '@/core/models/payment.model'

export const FREE_SCHEDULED_POSTS_LIMIT = 5
export const FREE_AUTOPILOT_RUNS_LIMIT = 5

export type UsageLimit = IUsageSummary['limits']['scheduled_posts']
export type UsageLimitKey = keyof IUsageSummary['limits']

const PAID_PLANS = new Set<BillingPlan>(['Pro', 'Team', 'Enterprise'])

export function isPaidPlan(plan: BillingPlan | null | undefined): boolean {
  return plan ? PAID_PLANS.has(plan) : false
}

export function canUseAdvancedStyle(
  plan: BillingPlan | null | undefined
): boolean {
  return isPaidPlan(plan)
}

export function canUseAnalytics(plan: BillingPlan | null | undefined): boolean {
  return isPaidPlan(plan)
}

export function isUnlimitedUsage(limit: UsageLimit | undefined): boolean {
  return limit?.total === -1
}

export function isUsageLimitReached(limit: UsageLimit | undefined): boolean {
  if (!limit || isUnlimitedUsage(limit)) return false

  return limit.used >= limit.total
}

export function isUsageLimitNear(limit: UsageLimit | undefined): boolean {
  if (!limit || isUnlimitedUsage(limit)) return false

  return limit.remaining <= 1 || limit.used >= limit.total - 1
}

export function shouldShowFreeLimitNudge(
  plan: BillingPlan | null | undefined,
  limit: UsageLimit | undefined
): boolean {
  return plan === 'Free' && isUsageLimitNear(limit)
}

export function getUsagePercent(limit: UsageLimit | undefined): number {
  if (!limit || limit.total <= 0 || isUnlimitedUsage(limit)) return 0

  return Math.min(100, Math.round((limit.used / limit.total) * 100))
}
