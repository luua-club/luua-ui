import { Box, Gem, type LucideIcon, Users } from 'lucide-react'

/** Matches org billing plan from API / `useUserState().plan`. */
export type PlanId = 'Free' | 'Pro' | 'Team'
export type BillingPlanId = PlanId | 'Enterprise'
export type PurchasablePlan = Extract<PlanId, 'Pro' | 'Team'>

export const PLAN_IDS: readonly PlanId[] = ['Free', 'Pro', 'Team']

export const PLAN_RANK: Record<BillingPlanId, number> = {
  Free: 0,
  Pro: 1,
  Team: 2,
  Enterprise: 3,
}

export type ComparisonCellValue = boolean | string

export interface ComparisonRow {
  label: string
  free: ComparisonCellValue
  pro: ComparisonCellValue
  team: ComparisonCellValue
}

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    label: 'Credits per month',
    free: '100',
    pro: '1,500',
    team: '5,000',
  },
  {
    label: 'Projects',
    free: '1',
    pro: '1',
    team: '5',
  },
  {
    label: 'Scheduled posts',
    free: '5 / month',
    pro: 'Unlimited',
    team: 'Unlimited',
  },
  {
    label: 'Autopilot runs',
    free: '5 / month',
    pro: 'Unlimited',
    team: 'Unlimited',
  },
  {
    label: 'Style generation',
    free: 'Basic',
    pro: 'Advanced',
    team: 'Advanced',
  },
  {
    label: 'Role-based access (RBAC)',
    free: false,
    pro: false,
    team: true,
  },
  {
    label: 'Audit logs',
    free: false,
    pro: false,
    team: true,
  },
]

export const ENTERPRISE_FEATURES = [
  'Unlimited users',
  'Unlimited projects',
  'Personalized credit volume',
  'Dedicated support',
  'SLA guarantee',
  'Custom invoicing',
  'SSO integration',
] as const

export interface PlanPricing {
  monthly: number
}

export const PLAN_PRICES: Record<PlanId, PlanPricing> = {
  Free: { monthly: 0 },
  Pro: { monthly: 15 },
  Team: { monthly: 49 },
}

export const PLAN_USER_LABELS: Record<PlanId, string> = {
  Free: '1 user',
  Pro: '1 user',
  Team: 'Up to 15 users',
}

export interface PlanCardCopy {
  title: string
  description: string
  isRecommended: boolean
}

export const PLAN_CARD_COPY: Record<PlanId, PlanCardCopy> = {
  Free: {
    title: 'Free',
    description: 'Perfect for hobbyists.',
    isRecommended: false,
  },
  Pro: {
    title: 'Pro',
    description: 'Ideal for professionals.',
    isRecommended: true,
  },
  Team: {
    title: 'Team',
    description: 'Best for growing teams.',
    isRecommended: false,
  },
}

export const PLAN_CARD_FEATURES: Record<PlanId, string[]> = {
  Free: [
    '100 credits / month',
    '5 scheduled posts / month',
    '5 autopilot runs / month',
    'Basic style generation',
    '1 project',
  ],
  Pro: [
    '1,500 credits / month',
    'Unlimited scheduling',
    'Unlimited autopilot',
    'Advanced style generation',
    '1 project',
  ],
  Team: [
    'Everything in Pro',
    '5,000 credits / month',
    'Up to 15 users, shared pool & billing',
    'RBAC & audit logs',
    '5 projects',
  ],
}

export const PLAN_ICONS: Record<PlanId, LucideIcon> = {
  Free: Box,
  Pro: Gem,
  Team: Users,
}

export function isHigherTier(
  planId: PlanId,
  activePlan: BillingPlanId
): boolean {
  return PLAN_RANK[planId] > PLAN_RANK[activePlan]
}

export function isPurchasablePlan(planId: PlanId): planId is PurchasablePlan {
  return planId === 'Pro' || planId === 'Team'
}

/** CTA label for any plan the user can switch to (not current). */
export const PLAN_UPGRADE_CTA = 'Upgrade'
